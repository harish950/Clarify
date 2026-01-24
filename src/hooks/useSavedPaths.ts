import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SavedPath, RoadmapStep } from '@/types/roadmap';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export function useSavedPaths() {
  const [isLoading, setIsLoading] = useState(false);
  const [savedPaths, setSavedPaths] = useState<SavedPath[]>([]);
  const { toast } = useToast();

  const loadSavedPaths = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('saved_paths')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Parse the data with proper typing
      const paths: SavedPath[] = (data || []).map(row => ({
        ...row,
        status: row.status as 'active' | 'paused' | 'completed',
        roadmap: (row.roadmap as unknown as RoadmapStep[]) || []
      }));
      setSavedPaths(paths);
    } catch (error) {
      console.error('Error loading saved paths:', error);
    }
  }, []);

  const startPath = useCallback(async (
    careerId: string, 
    careerName: string,
    missingSkills: string[] = [],
    matchedSkills: string[] = []
  ): Promise<{ roadmap: RoadmapStep[]; savedPath: SavedPath } | null> => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Not logged in',
          description: 'Please log in to save career paths',
          variant: 'destructive',
        });
        return null;
      }

      const { data, error } = await supabase.functions.invoke('generate-roadmap', {
        body: { 
          careerId, 
          careerName,
          missingSkills,
          matchedSkills
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: 'Path started!',
          description: `Your personalized roadmap to ${careerName} is ready.`,
        });
        
        // Refresh saved paths
        await loadSavedPaths();
        
        return {
          roadmap: data.roadmap,
          savedPath: data.savedPath
        };
      }

      throw new Error(data?.error || 'Failed to generate roadmap');
    } catch (error) {
      console.error('Error starting path:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start path',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast, loadSavedPaths]);

  const updateStepCompletion = useCallback(async (
    pathId: string, 
    stepId: string, 
    completed: boolean
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Get current path
      const { data: path, error: fetchError } = await supabase
        .from('saved_paths')
        .select('roadmap, progress_percentage')
        .eq('id', pathId)
        .single();

      if (fetchError) throw fetchError;

      // Update the step
      const currentRoadmap = (path.roadmap as unknown as RoadmapStep[]) || [];
      const roadmap = currentRoadmap.map(step => 
        step.id === stepId ? { ...step, completed } : step
      );

      // Calculate new progress
      const completedCount = roadmap.filter(s => s.completed).length;
      const progressPercentage = Math.round((completedCount / roadmap.length) * 100);

      // Update in database
      const { error: updateError } = await supabase
        .from('saved_paths')
        .update({ 
          roadmap: roadmap as unknown as Json, 
          progress_percentage: progressPercentage,
          status: progressPercentage === 100 ? 'completed' : 'active'
        })
        .eq('id', pathId);

      if (updateError) throw updateError;

      // Update local state
      setSavedPaths(prev => prev.map(p => 
        p.id === pathId 
          ? { ...p, roadmap, progress_percentage: progressPercentage }
          : p
      ));

      if (progressPercentage === 100) {
        toast({
          title: '🎉 Congratulations!',
          description: 'You\'ve completed your career path!',
        });
      }
    } catch (error) {
      console.error('Error updating step:', error);
      toast({
        title: 'Error',
        description: 'Failed to update step',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const getSavedPath = useCallback(async (careerId: string): Promise<SavedPath | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data, error } = await supabase
        .from('saved_paths')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('career_id', careerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        status: data.status as 'active' | 'paused' | 'completed',
        roadmap: (data.roadmap as unknown as RoadmapStep[]) || []
      } as SavedPath;
    } catch (error) {
      console.error('Error getting saved path:', error);
      return null;
    }
  }, []);

  return {
    isLoading,
    savedPaths,
    loadSavedPaths,
    startPath,
    updateStepCompletion,
    getSavedPath
  };
}
