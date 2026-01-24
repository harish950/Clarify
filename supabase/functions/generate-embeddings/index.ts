import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProfileData {
  resumeText?: string;
  skills: string[];
  interests: string[];
  experience?: string;
  careerGoals?: string[];
  workEnvironment?: string;
  salaryRange?: string;
  name?: string;
  email?: string;
  linkedinUrl?: string;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  // Use Gemini to create a semantic representation, then hash to vector
  // Since we don't have direct embedding API, we'll use AI to generate semantic keywords
  // and create a deterministic embedding from them
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: `You are an embedding generator. Extract exactly 50 semantic keywords/concepts from the input text that best represent its meaning for job matching. Output ONLY a JSON array of 50 strings, nothing else. Focus on: skills, technologies, industries, job roles, experience levels, and career aspirations.`
        },
        {
          role: "user",
          content: text.substring(0, 3000) // Limit input size
        }
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Embedding generation failed:", error);
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "[]";
  
  // Parse keywords and generate a pseudo-embedding
  let keywords: string[] = [];
  try {
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    keywords = JSON.parse(cleanContent);
  } catch {
    // Fallback: split by common delimiters
    keywords = content.split(/[,\n]/).map((k: string) => k.trim()).filter((k: string) => k.length > 0);
  }

  // Generate a 768-dimensional embedding from keywords using deterministic hashing
  const embedding = new Array(768).fill(0);
  
  keywords.forEach((keyword, i) => {
    // Sanitize keyword - remove null chars and non-printable characters
    const sanitized = String(keyword).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    if (!sanitized) return;
    
    const hash = simpleHash(sanitized.toLowerCase());
    for (let j = 0; j < 768; j++) {
      // Distribute the hash across dimensions with varying weights
      embedding[j] += Math.sin(hash * (j + 1) * 0.001) * (1 / (i + 1));
    }
  });

  // Normalize the embedding
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userId = claims.claims.sub;
    const profileData: ProfileData = await req.json();

    console.log(`Generating embeddings for user: ${userId}`);

    // Create text representations for each vector
    const skillsText = `Skills and competencies: ${profileData.skills.join(', ')}. 
      Technical abilities include: ${profileData.skills.slice(0, 10).join(', ')}.`;
    
    const experienceText = `Professional experience: ${profileData.experience || 'Entry level'}. 
      Resume summary: ${profileData.resumeText?.substring(0, 1500) || 'No resume provided'}.
      Career goals: ${profileData.careerGoals?.join(', ') || 'Career growth'}.`;
    
    const interestsText = `Career interests: ${profileData.interests.join(', ')}.
      Preferred work environment: ${profileData.workEnvironment || 'Flexible'}.
      Salary expectations: ${profileData.salaryRange || 'Competitive'}.
      Aspirations: ${profileData.careerGoals?.join(', ') || 'Professional development'}.`;

    // Generate embeddings in parallel
    const [skillsEmbedding, experienceEmbedding, interestsEmbedding] = await Promise.all([
      generateEmbedding(skillsText),
      generateEmbedding(experienceText),
      generateEmbedding(interestsText),
    ]);

    console.log(`Generated embeddings - Skills: ${skillsEmbedding.length}, Experience: ${experienceEmbedding.length}, Interests: ${interestsEmbedding.length}`);

    // Format embeddings as pgvector strings - ensure no special chars
    const formatVector = (arr: number[]) => {
      const cleanValues = arr.map(v => {
        const num = Number(v);
        return isNaN(num) ? 0 : parseFloat(num.toFixed(8));
      });
      return `[${cleanValues.join(',')}]`;
    };
    
    // Sanitize text fields to remove null characters
    const sanitizeText = (text: string | undefined): string | undefined => {
      if (!text) return text;
      return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    };

    // Upsert user profile with embeddings
    const { error: upsertError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        name: sanitizeText(profileData.name),
        email: sanitizeText(profileData.email),
        resume_text: sanitizeText(profileData.resumeText),
        linkedin_url: sanitizeText(profileData.linkedinUrl),
        parsed_skills: (profileData.skills || []).map(s => sanitizeText(s) || '').filter(Boolean),
        parsed_experience: sanitizeText(profileData.experience),
        interests: (profileData.interests || []).map(i => sanitizeText(i) || '').filter(Boolean),
        work_environment: sanitizeText(profileData.workEnvironment),
        salary_range: sanitizeText(profileData.salaryRange),
        career_goals: (profileData.careerGoals || []).map(g => sanitizeText(g) || '').filter(Boolean),
        skills_embedding: formatVector(skillsEmbedding),
        experience_embedding: formatVector(experienceEmbedding),
        interests_embedding: formatVector(interestsEmbedding),
        embedding_updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Profile upsert error:', upsertError);
      throw upsertError;
    }

    console.log(`Successfully stored embeddings for user: ${userId}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Embeddings generated and stored successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Generate embeddings error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
