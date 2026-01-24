import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pre-defined roadmap templates by career category
const roadmapTemplates: Record<string, { phases: { name: string; description: string; type: 'skill' | 'project' | 'course' | 'milestone'; duration: string }[] }> = {
  'ml-engineer': {
    phases: [
      { name: 'Python & Math Foundations', description: 'Master Python programming and linear algebra basics', type: 'course', duration: '4 weeks' },
      { name: 'Machine Learning Fundamentals', description: 'Learn supervised and unsupervised learning algorithms', type: 'course', duration: '6 weeks' },
      { name: 'Build a Classification Model', description: 'Create an end-to-end ML project with real data', type: 'project', duration: '2 weeks' },
      { name: 'Deep Learning & Neural Networks', description: 'Master PyTorch or TensorFlow frameworks', type: 'skill', duration: '6 weeks' },
      { name: 'Deploy ML Model to Production', description: 'Build and deploy a model API with MLOps practices', type: 'project', duration: '3 weeks' },
      { name: 'Complete First ML Role', description: 'Apply to ML positions and land your first role', type: 'milestone', duration: '4 weeks' },
    ]
  },
  'data-scientist': {
    phases: [
      { name: 'Statistics & Probability', description: 'Build a strong foundation in statistical analysis', type: 'course', duration: '4 weeks' },
      { name: 'Data Analysis with Python', description: 'Master pandas, numpy, and data visualization', type: 'skill', duration: '4 weeks' },
      { name: 'Exploratory Data Analysis Project', description: 'Analyze a real-world dataset and present insights', type: 'project', duration: '2 weeks' },
      { name: 'Machine Learning for Data Science', description: 'Learn predictive modeling and feature engineering', type: 'course', duration: '6 weeks' },
      { name: 'End-to-End Data Science Project', description: 'Complete a full DS project from data to insights', type: 'project', duration: '3 weeks' },
      { name: 'First Data Science Position', description: 'Apply and interview for DS roles', type: 'milestone', duration: '4 weeks' },
    ]
  },
  'frontend-developer': {
    phases: [
      { name: 'HTML, CSS & JavaScript Mastery', description: 'Build strong fundamentals in web technologies', type: 'course', duration: '6 weeks' },
      { name: 'React Fundamentals', description: 'Learn component-based architecture and hooks', type: 'skill', duration: '4 weeks' },
      { name: 'Build a Portfolio Website', description: 'Create a responsive personal portfolio', type: 'project', duration: '2 weeks' },
      { name: 'Advanced React & TypeScript', description: 'Master state management and type safety', type: 'skill', duration: '4 weeks' },
      { name: 'Full-Stack Web Application', description: 'Build a complete web app with authentication', type: 'project', duration: '4 weeks' },
      { name: 'Land Frontend Role', description: 'Apply to frontend developer positions', type: 'milestone', duration: '4 weeks' },
    ]
  },
  'product-manager': {
    phases: [
      { name: 'Product Management Fundamentals', description: 'Learn product lifecycle and stakeholder management', type: 'course', duration: '4 weeks' },
      { name: 'User Research & Discovery', description: 'Master user interviews and problem validation', type: 'skill', duration: '3 weeks' },
      { name: 'Write Your First PRD', description: 'Create a comprehensive product requirements document', type: 'project', duration: '2 weeks' },
      { name: 'Agile & Scrum Methodologies', description: 'Learn sprint planning and backlog management', type: 'skill', duration: '3 weeks' },
      { name: 'Lead a Product Launch', description: 'Plan and execute a product launch strategy', type: 'project', duration: '4 weeks' },
      { name: 'First PM Position', description: 'Interview and land your first PM role', type: 'milestone', duration: '4 weeks' },
    ]
  },
  'default': {
    phases: [
      { name: 'Foundation Building', description: 'Learn core concepts and fundamentals', type: 'course', duration: '4 weeks' },
      { name: 'Skill Development', description: 'Build practical skills through hands-on practice', type: 'skill', duration: '4 weeks' },
      { name: 'First Project', description: 'Apply your knowledge in a real project', type: 'project', duration: '3 weeks' },
      { name: 'Advanced Topics', description: 'Deepen expertise in specialized areas', type: 'skill', duration: '4 weeks' },
      { name: 'Portfolio Project', description: 'Build a showcase project for your portfolio', type: 'project', duration: '3 weeks' },
      { name: 'Career Transition', description: 'Apply to positions and land your first role', type: 'milestone', duration: '4 weeks' },
    ]
  }
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the user from the JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { careerId, careerName, missingSkills = [], matchedSkills = [] } = await req.json();
    
    if (!careerId || !careerName) {
      return new Response(JSON.stringify({ error: 'Missing careerId or careerName' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating roadmap for user ${user.id}, career: ${careerName}`);

    // Get user profile for personalization context
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('parsed_skills, parsed_experience, interests')
      .eq('user_id', user.id)
      .single();

    // Get the base template
    const templateKey = Object.keys(roadmapTemplates).find(key => 
      careerId.toLowerCase().includes(key) || careerName.toLowerCase().includes(key.replace('-', ' '))
    ) || 'default';
    
    const template = roadmapTemplates[templateKey];

    // Use AI to personalize the roadmap based on user's skills and gaps
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.log('No LOVABLE_API_KEY, returning template-based roadmap');
      // Return template-based roadmap without AI personalization
      const roadmap = template.phases.map((phase, index) => ({
        id: `step-${index + 1}`,
        name: phase.name,
        description: phase.description,
        type: phase.type,
        duration: phase.duration,
        order: index + 1,
        completed: false,
        resources: []
      }));

      // Save the path and roadmap
      const { data: savedPath, error: saveError } = await supabase
        .from('saved_paths')
        .upsert({
          user_id: user.id,
          career_id: careerId,
          career_name: careerName,
          roadmap: roadmap,
          status: 'active',
          progress_percentage: 0
        }, {
          onConflict: 'user_id,career_id'
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving path:', saveError);
        throw saveError;
      }

      return new Response(JSON.stringify({ 
        success: true, 
        roadmap,
        savedPath
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build AI prompt for personalization
    const systemPrompt = `You are a career coach AI that personalizes learning roadmaps. Given a user's current skills, missing skills, and a career template, you output a personalized roadmap that:
1. Acknowledges skills they already have (mark as completed or skip)
2. Focuses on their specific skill gaps
3. Provides actionable, specific steps with resource recommendations
4. Keeps the same structure but customizes content

Output a JSON array of roadmap steps.`;

    const userPrompt = `Career Goal: ${careerName}

User's Current Skills: ${matchedSkills.join(', ') || 'None specified'}
Skills to Learn: ${missingSkills.join(', ') || 'General skills for this role'}
User Experience: ${profile?.parsed_experience || 'Not specified'}
User Interests: ${(profile?.interests || []).join(', ') || 'Not specified'}

Base Template Phases:
${template.phases.map((p, i) => `${i + 1}. ${p.name} (${p.type}, ${p.duration}): ${p.description}`).join('\n')}

Create a personalized 5-7 step roadmap focusing on their skill gaps. Each step should have:
- name: Short title
- description: 1-2 sentence description
- type: skill, project, course, or milestone
- duration: Estimated time
- resources: Array of 1-2 recommended resources (name and type like "course", "tutorial", "book")`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'create_roadmap',
            description: 'Create a personalized career roadmap',
            parameters: {
              type: 'object',
              properties: {
                steps: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      description: { type: 'string' },
                      type: { type: 'string', enum: ['skill', 'project', 'course', 'milestone'] },
                      duration: { type: 'string' },
                      resources: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            type: { type: 'string' }
                          },
                          required: ['name', 'type']
                        }
                      }
                    },
                    required: ['name', 'description', 'type', 'duration']
                  }
                }
              },
              required: ['steps']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'create_roadmap' } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      // Fallback to template
      const roadmap = template.phases.map((phase, index) => ({
        id: `step-${index + 1}`,
        name: phase.name,
        description: phase.description,
        type: phase.type,
        duration: phase.duration,
        order: index + 1,
        completed: false,
        resources: []
      }));

      const { data: savedPath } = await supabase
        .from('saved_paths')
        .upsert({
          user_id: user.id,
          career_id: careerId,
          career_name: careerName,
          roadmap: roadmap,
          status: 'active',
          progress_percentage: 0
        }, { onConflict: 'user_id,career_id' })
        .select()
        .single();

      return new Response(JSON.stringify({ success: true, roadmap, savedPath }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiResponse.json();
    console.log('AI response:', JSON.stringify(aiData));

    // Extract the tool call result
    let roadmapSteps = template.phases;
    try {
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const parsed = JSON.parse(toolCall.function.arguments);
        if (parsed.steps && Array.isArray(parsed.steps)) {
          roadmapSteps = parsed.steps;
        }
      }
    } catch (parseError) {
      console.error('Error parsing AI response, using template:', parseError);
    }

    // Format the roadmap
    const roadmap = roadmapSteps.map((step: any, index: number) => ({
      id: `step-${index + 1}`,
      name: step.name,
      description: step.description,
      type: step.type || 'skill',
      duration: step.duration || '2-4 weeks',
      order: index + 1,
      completed: false,
      resources: step.resources || []
    }));

    // Save the path and roadmap
    const { data: savedPath, error: saveError } = await supabase
      .from('saved_paths')
      .upsert({
        user_id: user.id,
        career_id: careerId,
        career_name: careerName,
        roadmap: roadmap,
        status: 'active',
        progress_percentage: 0
      }, {
        onConflict: 'user_id,career_id'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving path:', saveError);
      throw saveError;
    }

    console.log('Roadmap generated and saved successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      roadmap,
      savedPath
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating roadmap:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
