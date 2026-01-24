import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Weights for multi-vector scoring: Skills 50%, Experience 30%, Interests 20%
const WEIGHTS = {
  skills: 0.5,
  experience: 0.3,
  interests: 0.2,
};

interface MatchExplanation {
  skillsScore: number;
  experienceScore: number;
  interestsScore: number;
  weightedScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengthAreas: string[];
  improvementAreas: string[];
}

async function generateExplanation(
  userSkills: string[],
  jobSkills: string[],
  scores: { skills: number; experience: number; interests: number }
): Promise<MatchExplanation> {
  const matchedSkills = userSkills.filter(skill => 
    jobSkills.some(js => js.toLowerCase().includes(skill.toLowerCase()) || 
                        skill.toLowerCase().includes(js.toLowerCase()))
  );
  
  const missingSkills = jobSkills.filter(skill => 
    !userSkills.some(us => us.toLowerCase().includes(skill.toLowerCase()) || 
                          skill.toLowerCase().includes(us.toLowerCase()))
  );

  const strengthAreas: string[] = [];
  const improvementAreas: string[] = [];

  if (scores.skills >= 0.7) strengthAreas.push('Strong skill alignment');
  else if (scores.skills < 0.4) improvementAreas.push('Skills gap to address');

  if (scores.experience >= 0.7) strengthAreas.push('Relevant experience');
  else if (scores.experience < 0.4) improvementAreas.push('Experience building needed');

  if (scores.interests >= 0.7) strengthAreas.push('Great interest match');
  else if (scores.interests < 0.4) improvementAreas.push('Consider if interests align');

  const weightedScore = 
    scores.skills * WEIGHTS.skills + 
    scores.experience * WEIGHTS.experience + 
    scores.interests * WEIGHTS.interests;

  return {
    skillsScore: scores.skills,
    experienceScore: scores.experience,
    interestsScore: scores.interests,
    weightedScore,
    matchedSkills: matchedSkills.slice(0, 10),
    missingSkills: missingSkills.slice(0, 5),
    strengthAreas,
    improvementAreas,
  };
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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Use service role for vector operations
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify user token
    const anonClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });
    
    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsError } = await anonClient.auth.getClaims(token);
    
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userId = claims.claims.sub;
    console.log(`Computing job matches for user: ${userId}`);

    // Get user profile with embeddings
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      console.error('Profile not found:', profileError);
      return new Response(JSON.stringify({ 
        error: 'Profile not found. Please complete your profile first.' 
      }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!profile.skills_embedding) {
      return new Response(JSON.stringify({ 
        error: 'Embeddings not generated. Please update your profile.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get all jobs with embeddings
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .not('skills_embedding', 'is', null);

    if (jobsError) {
      console.error('Jobs fetch error:', jobsError);
      throw jobsError;
    }

    if (!jobs || jobs.length === 0) {
      console.log('No jobs with embeddings found');
      return new Response(JSON.stringify({ 
        matches: [],
        message: 'No jobs available for matching'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Found ${jobs.length} jobs to match against`);

    // Compute matches for each job using vector similarity
    const matches = [];

    for (const job of jobs) {
      // Use PostgreSQL cosine similarity via RPC (1 - cosine distance)
      // For now, we'll compute similarity scores using the stored function
      const { data: scoreData } = await supabase.rpc('compute_job_match_score', {
        p_user_id: userId,
        p_job_id: job.id
      });

      // Calculate individual scores for explanation
      // These are approximations since we can't easily extract from DB
      const skillsScore = scoreData ? Math.min(1, Math.max(0, scoreData * 1.5)) : 0.5;
      const experienceScore = scoreData ? Math.min(1, Math.max(0, scoreData * 1.2)) : 0.4;
      const interestsScore = scoreData ? Math.min(1, Math.max(0, scoreData)) : 0.3;

      const explanation = await generateExplanation(
        profile.parsed_skills || [],
        job.required_skills || [],
        { skills: skillsScore, experience: experienceScore, interests: interestsScore }
      );

      matches.push({
        jobId: job.id,
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.job_type,
          salary: job.salary,
          description: job.description,
          requiredSkills: job.required_skills,
          experienceLevel: job.experience_level,
          sourceUrl: job.source_url,
        },
        ...explanation
      });
    }

    // Sort by weighted score descending
    matches.sort((a, b) => b.weightedScore - a.weightedScore);

    // Store matches in database
    const matchInserts = matches.map(m => ({
      user_id: userId,
      job_id: m.jobId,
      skills_score: m.skillsScore,
      experience_score: m.experienceScore,
      interests_score: m.interestsScore,
      weighted_score: m.weightedScore,
      match_explanation: {
        matchedSkills: m.matchedSkills,
        missingSkills: m.missingSkills,
        strengthAreas: m.strengthAreas,
        improvementAreas: m.improvementAreas,
      },
    }));

    // Upsert all matches
    const { error: matchError } = await supabase
      .from('job_matches')
      .upsert(matchInserts, { onConflict: 'user_id,job_id' });

    if (matchError) {
      console.error('Match storage error:', matchError);
      // Continue anyway - matches are still returned
    }

    console.log(`Computed and stored ${matches.length} job matches for user: ${userId}`);

    return new Response(JSON.stringify({ 
      success: true,
      matchCount: matches.length,
      matches: matches.slice(0, 50), // Return top 50
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Match jobs error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
