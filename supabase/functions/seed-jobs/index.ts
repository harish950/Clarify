import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample jobs to seed the database with embeddings
const SAMPLE_JOBS = [
  {
    external_id: 'fe-001',
    title: 'Frontend Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    job_type: 'Full-time',
    salary: '$120,000 - $160,000',
    description: 'Build modern web applications using React, TypeScript, and modern frontend technologies. Work with designers and backend engineers to create seamless user experiences.',
    required_skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Git', 'REST APIs'],
    experience_level: 'Mid-level',
    source_url: 'https://example.com/jobs/fe-001',
  },
  {
    external_id: 'be-001',
    title: 'Backend Engineer',
    company: 'DataFlow Systems',
    location: 'Remote',
    job_type: 'Full-time',
    salary: '$130,000 - $180,000',
    description: 'Design and build scalable backend services using Node.js and Python. Work with databases, APIs, and cloud infrastructure.',
    required_skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'REST APIs', 'Git'],
    experience_level: 'Senior',
    source_url: 'https://example.com/jobs/be-001',
  },
  {
    external_id: 'fs-001',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    job_type: 'Full-time',
    salary: '$100,000 - $150,000',
    description: 'Join our fast-growing startup to build end-to-end web applications. Work on both frontend and backend, from database design to UI implementation.',
    required_skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Git'],
    experience_level: 'Mid-level',
    source_url: 'https://example.com/jobs/fs-001',
  },
  {
    external_id: 'ds-001',
    title: 'Data Scientist',
    company: 'Analytics Corp',
    location: 'Boston, MA',
    job_type: 'Full-time',
    salary: '$140,000 - $190,000',
    description: 'Apply machine learning and statistical methods to solve complex business problems. Work with large datasets and build predictive models.',
    required_skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'Pandas', 'Data Visualization'],
    experience_level: 'Senior',
    source_url: 'https://example.com/jobs/ds-001',
  },
  {
    external_id: 'pm-001',
    title: 'Product Manager',
    company: 'Product Labs',
    location: 'Seattle, WA',
    job_type: 'Full-time',
    salary: '$150,000 - $200,000',
    description: 'Lead product strategy and execution for our flagship product. Work with engineering, design, and marketing teams to deliver exceptional user experiences.',
    required_skills: ['Product Strategy', 'User Research', 'Agile', 'Data Analysis', 'Communication', 'Leadership'],
    experience_level: 'Senior',
    source_url: 'https://example.com/jobs/pm-001',
  },
  {
    external_id: 'ux-001',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Los Angeles, CA',
    job_type: 'Full-time',
    salary: '$90,000 - $130,000',
    description: 'Create beautiful and intuitive user interfaces. Conduct user research, create wireframes and prototypes, and work closely with developers.',
    required_skills: ['Figma', 'User Research', 'Prototyping', 'UI Design', 'Design Systems', 'Usability Testing'],
    experience_level: 'Mid-level',
    source_url: 'https://example.com/jobs/ux-001',
  },
  {
    external_id: 'devops-001',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Remote',
    job_type: 'Full-time',
    salary: '$140,000 - $180,000',
    description: 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability and security.',
    required_skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'Linux', 'Python'],
    experience_level: 'Senior',
    source_url: 'https://example.com/jobs/devops-001',
  },
  {
    external_id: 'ml-001',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'San Francisco, CA',
    job_type: 'Full-time',
    salary: '$180,000 - $250,000',
    description: 'Build and deploy production ML models. Work on cutting-edge AI/ML projects including NLP, computer vision, and recommendation systems.',
    required_skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'MLOps', 'SQL'],
    experience_level: 'Senior',
    source_url: 'https://example.com/jobs/ml-001',
  },
  {
    external_id: 'da-001',
    title: 'Data Analyst',
    company: 'Insights Co',
    location: 'Chicago, IL',
    job_type: 'Full-time',
    salary: '$70,000 - $100,000',
    description: 'Analyze data to provide actionable insights for business decisions. Create dashboards and reports using modern analytics tools.',
    required_skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics', 'Data Visualization', 'Communication'],
    experience_level: 'Entry-level',
    source_url: 'https://example.com/jobs/da-001',
  },
  {
    external_id: 'mobile-001',
    title: 'Mobile Developer',
    company: 'AppWorks',
    location: 'Austin, TX',
    job_type: 'Full-time',
    salary: '$110,000 - $150,000',
    description: 'Build cross-platform mobile applications using React Native. Work on iOS and Android apps from conception to deployment.',
    required_skills: ['React Native', 'JavaScript', 'TypeScript', 'iOS', 'Android', 'Git', 'REST APIs'],
    experience_level: 'Mid-level',
    source_url: 'https://example.com/jobs/mobile-001',
  },
];

async function generateJobEmbedding(text: string): Promise<number[]> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
          content: `You are an embedding generator for job postings. Extract exactly 50 semantic keywords/concepts that best represent this job for matching with candidates. Output ONLY a JSON array of 50 strings. Focus on: required skills, technologies, job responsibilities, experience requirements, and industry context.`
        },
        {
          role: "user",
          content: text.substring(0, 3000)
        }
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI request failed: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "[]";
  
  let keywords: string[] = [];
  try {
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    keywords = JSON.parse(cleanContent);
  } catch {
    keywords = content.split(/[,\n]/).map((k: string) => k.trim()).filter((k: string) => k.length > 0);
  }

  // Generate 768-dimensional embedding
  const embedding = new Array(768).fill(0);
  
  keywords.forEach((keyword, i) => {
    const hash = simpleHash(keyword.toLowerCase());
    for (let j = 0; j < 768; j++) {
      embedding[j] += Math.sin(hash * (j + 1) * 0.001) * (1 / (i + 1));
    }
  });

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Check if jobs already exist - skip seeding if so
    const { count, error: countError } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking existing jobs:', countError);
    } else if (count && count > 0) {
      console.log(`Jobs already exist (${count} found), skipping seed`);
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Jobs already seeded',
        skipped: true,
        existingCount: count
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Starting job seeding...');

    const results = [];

    for (const job of SAMPLE_JOBS) {
      console.log(`Processing job: ${job.title}`);

      // Create text representations for embeddings
      const skillsText = `Required skills: ${job.required_skills.join(', ')}`;
      const experienceText = `Experience level: ${job.experience_level}. Role: ${job.title} at ${job.company}`;
      const descriptionText = job.description;

      try {
        // Generate embeddings
        const [skillsEmb, experienceEmb, descriptionEmb] = await Promise.all([
          generateJobEmbedding(skillsText),
          generateJobEmbedding(experienceText),
          generateJobEmbedding(descriptionText),
        ]);

        const formatVector = (arr: number[]) => `[${arr.join(',')}]`;

        // Upsert job with embeddings
        const { error } = await supabase
          .from('jobs')
          .upsert({
            ...job,
            skills_embedding: formatVector(skillsEmb),
            experience_embedding: formatVector(experienceEmb),
            description_embedding: formatVector(descriptionEmb),
            embedding_updated_at: new Date().toISOString(),
          }, { onConflict: 'external_id' });

        if (error) {
          console.error(`Error seeding job ${job.title}:`, error);
          results.push({ job: job.title, success: false, error: error.message });
        } else {
          results.push({ job: job.title, success: true });
        }
      } catch (embError) {
        console.error(`Embedding error for ${job.title}:`, embError);
        results.push({ job: job.title, success: false, error: String(embError) });
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('Job seeding completed');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Jobs seeded successfully',
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Seed jobs error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
