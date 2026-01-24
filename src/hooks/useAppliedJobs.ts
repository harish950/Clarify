import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ApplicationStatus = 'applied' | 'interviewing' | 'offered' | 'rejected' | 'withdrawn';

export interface AppliedJob {
  id: string;
  job_id: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  notes: string | null;
  job?: {
    id: string;
    title: string;
    company: string | null;
    location: string | null;
  };
}

export function useAppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppliedJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAppliedJobs([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('applied_jobs')
        .select(`
          id,
          job_id,
          status,
          applied_at,
          updated_at,
          notes,
          job:jobs(id, title, company, location)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        job: Array.isArray(item.job) ? item.job[0] : item.job
      })) as AppliedJob[];

      setAppliedJobs(transformedData);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchAppliedJobs();
    });

    return () => subscription.unsubscribe();
  }, []);

  const applyToJob = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to apply to jobs.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('applied_jobs')
        .insert({
          user_id: user.id,
          job_id: jobId,
          status: 'applied'
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already applied",
            description: "You have already applied to this job.",
          });
        } else {
          throw error;
        }
        return false;
      }

      toast({
        title: "Application saved",
        description: "Job added to your applied jobs list.",
      });

      await fetchAppliedJobs();
      return true;
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Error",
        description: "Failed to save application. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateStatus = async (applicationId: string, status: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from('applied_jobs')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      setAppliedJobs(prev =>
        prev.map(job =>
          job.id === applicationId ? { ...job, status } : job
        )
      );

      toast({
        title: "Status updated",
        description: `Application status changed to ${status}.`,
      });

      return true;
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applied_jobs')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      setAppliedJobs(prev => prev.filter(job => job.id !== applicationId));

      toast({
        title: "Application removed",
        description: "Job removed from your applied jobs list.",
      });

      return true;
    } catch (error) {
      console.error('Error removing application:', error);
      toast({
        title: "Error",
        description: "Failed to remove application. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const isJobApplied = (jobId: string) => {
    return appliedJobs.some(job => job.job_id === jobId);
  };

  return {
    appliedJobs,
    isLoading,
    applyToJob,
    updateStatus,
    removeApplication,
    isJobApplied,
    refetch: fetchAppliedJobs
  };
}
