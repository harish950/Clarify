-- Enable pgvector extension for embedding storage
CREATE EXTENSION IF NOT EXISTS vector;

-- User profiles table to store parsed resume/questionnaire data
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  resume_text TEXT,
  linkedin_url TEXT,
  parsed_skills TEXT[] DEFAULT '{}',
  parsed_experience TEXT,
  interests TEXT[] DEFAULT '{}',
  work_environment TEXT,
  salary_range TEXT,
  career_goals TEXT[] DEFAULT '{}',
  skills_embedding vector(768),
  experience_embedding vector(768),
  interests_embedding vector(768),
  embedding_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Jobs table with embeddings
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE,
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  job_type TEXT,
  salary TEXT,
  description TEXT,
  required_skills TEXT[] DEFAULT '{}',
  experience_level TEXT,
  source_url TEXT,
  skills_embedding vector(768),
  experience_embedding vector(768),
  description_embedding vector(768),
  embedding_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job matches table to store computed similarity scores
CREATE TABLE public.job_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skills_score FLOAT DEFAULT 0,
  experience_score FLOAT DEFAULT 0,
  interests_score FLOAT DEFAULT 0,
  weighted_score FLOAT DEFAULT 0,
  match_explanation JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Create indexes for vector similarity search
CREATE INDEX idx_jobs_skills_embedding ON public.jobs USING ivfflat (skills_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_jobs_experience_embedding ON public.jobs USING ivfflat (experience_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_jobs_description_embedding ON public.jobs USING ivfflat (description_embedding vector_cosine_ops) WITH (lists = 100);

-- Create index on user profiles
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_job_matches_user_id ON public.job_matches(user_id);
CREATE INDEX idx_job_matches_weighted_score ON public.job_matches(weighted_score DESC);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for jobs (public read)
CREATE POLICY "Jobs are publicly viewable"
  ON public.jobs FOR SELECT
  USING (true);

-- RLS policies for job_matches
CREATE POLICY "Users can view their own matches"
  ON public.job_matches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own matches"
  ON public.job_matches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own matches"
  ON public.job_matches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own matches"
  ON public.job_matches FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_matches_updated_at
  BEFORE UPDATE ON public.job_matches
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to compute cosine similarity and weighted score
CREATE OR REPLACE FUNCTION public.compute_job_match_score(
  p_user_id UUID,
  p_job_id UUID
) RETURNS FLOAT AS $$
DECLARE
  v_user_profile user_profiles%ROWTYPE;
  v_job jobs%ROWTYPE;
  v_skills_score FLOAT := 0;
  v_experience_score FLOAT := 0;
  v_interests_score FLOAT := 0;
  v_weighted_score FLOAT;
BEGIN
  SELECT * INTO v_user_profile FROM user_profiles WHERE user_id = p_user_id;
  SELECT * INTO v_job FROM jobs WHERE id = p_job_id;
  
  IF v_user_profile.skills_embedding IS NOT NULL AND v_job.skills_embedding IS NOT NULL THEN
    v_skills_score := 1 - (v_user_profile.skills_embedding <=> v_job.skills_embedding);
  END IF;
  
  IF v_user_profile.experience_embedding IS NOT NULL AND v_job.experience_embedding IS NOT NULL THEN
    v_experience_score := 1 - (v_user_profile.experience_embedding <=> v_job.experience_embedding);
  END IF;
  
  IF v_user_profile.interests_embedding IS NOT NULL AND v_job.description_embedding IS NOT NULL THEN
    v_interests_score := 1 - (v_user_profile.interests_embedding <=> v_job.description_embedding);
  END IF;
  
  -- Weighted scoring: Skills 50%, Experience 30%, Interests 20%
  v_weighted_score := (v_skills_score * 0.5) + (v_experience_score * 0.3) + (v_interests_score * 0.2);
  
  RETURN v_weighted_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;