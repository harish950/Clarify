-- Create table for tracking applied jobs
CREATE TABLE public.applied_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE public.applied_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own applied jobs" 
ON public.applied_jobs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applied jobs" 
ON public.applied_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applied jobs" 
ON public.applied_jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applied jobs" 
ON public.applied_jobs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_applied_jobs_updated_at
BEFORE UPDATE ON public.applied_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();