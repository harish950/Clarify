import { supabase } from '@/integrations/supabase/client';
import { UserProfileData, JobMatch } from '@/types/matching';

export async function generateUserEmbeddings(profileData: UserProfileData): Promise<{ success: boolean; error?: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase.functions.invoke('generate-embeddings', {
    body: profileData,
  });

  if (error) {
    console.error('Generate embeddings error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function matchUserToJobs(): Promise<{ matches: JobMatch[]; error?: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { matches: [], error: 'Not authenticated' };
  }

  const { data, error } = await supabase.functions.invoke('match-jobs', {});

  if (error) {
    console.error('Match jobs error:', error);
    return { matches: [], error: error.message };
  }

  return { matches: data?.matches || [] };
}

export async function getStoredMatches(): Promise<JobMatch[]> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return [];
  }

  const { data: matches, error } = await supabase
    .from('job_matches')
    .select(`
      id,
      job_id,
      skills_score,
      experience_score,
      interests_score,
      weighted_score,
      match_explanation,
      jobs (
        id,
        title,
        company,
        location,
        job_type,
        salary,
        description,
        required_skills,
        experience_level,
        source_url
      )
    `)
    .eq('user_id', session.user.id)
    .order('weighted_score', { ascending: false });

  if (error) {
    console.error('Get stored matches error:', error);
    return [];
  }

  return (matches || []).map((m: any) => ({
    jobId: m.job_id,
    job: {
      id: m.jobs?.id || m.job_id,
      title: m.jobs?.title || 'Unknown',
      company: m.jobs?.company || '',
      location: m.jobs?.location || '',
      jobType: m.jobs?.job_type || '',
      salary: m.jobs?.salary || '',
      description: m.jobs?.description || '',
      requiredSkills: m.jobs?.required_skills || [],
      experienceLevel: m.jobs?.experience_level || '',
      sourceUrl: m.jobs?.source_url || '',
    },
    skillsScore: m.skills_score,
    experienceScore: m.experience_score,
    interestsScore: m.interests_score,
    weightedScore: m.weighted_score,
    matchedSkills: m.match_explanation?.matchedSkills || [],
    missingSkills: m.match_explanation?.missingSkills || [],
    strengthAreas: m.match_explanation?.strengthAreas || [],
    improvementAreas: m.match_explanation?.improvementAreas || [],
  }));
}

export async function seedJobs(): Promise<{ success: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke('seed-jobs', {});

  if (error) {
    console.error('Seed jobs error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
