-- Create saved_paths table to track user's career paths
CREATE TABLE public.saved_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  career_id TEXT NOT NULL,
  career_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  roadmap JSONB DEFAULT '[]'::jsonb,
  progress_percentage INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, career_id)
);

-- Enable Row Level Security
ALTER TABLE public.saved_paths ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own paths"
ON public.saved_paths
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own paths"
ON public.saved_paths
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paths"
ON public.saved_paths
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own paths"
ON public.saved_paths
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_paths_updated_at
BEFORE UPDATE ON public.saved_paths
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();