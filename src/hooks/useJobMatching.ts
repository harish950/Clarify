import { useState, useEffect, useCallback } from 'react';
import { JobMatch, MatchFilters } from '@/types/matching';
import { matchUserToJobs, getStoredMatches } from '@/services/matchingService';
import { useToast } from '@/hooks/use-toast';

const DEFAULT_FILTERS: MatchFilters = {
  minScore: 0,
  jobType: [],
  location: [],
  experienceLevel: [],
  salaryRange: null,
};

export function useJobMatching() {
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<JobMatch[]>([]);
  const [filters, setFilters] = useState<MatchFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Apply filters to matches
  useEffect(() => {
    let result = [...matches];

    // Filter by minimum score
    if (filters.minScore > 0) {
      result = result.filter(m => m.weightedScore * 100 >= filters.minScore);
    }

    // Filter by job type
    if (filters.jobType.length > 0) {
      result = result.filter(m => 
        filters.jobType.some(t => m.job.jobType.toLowerCase().includes(t.toLowerCase()))
      );
    }

    // Filter by location
    if (filters.location.length > 0) {
      result = result.filter(m => 
        filters.location.some(l => 
          m.job.location.toLowerCase().includes(l.toLowerCase()) ||
          l.toLowerCase() === 'remote' && m.job.location.toLowerCase().includes('remote')
        )
      );
    }

    // Filter by experience level
    if (filters.experienceLevel.length > 0) {
      result = result.filter(m => 
        filters.experienceLevel.some(e => 
          m.job.experienceLevel.toLowerCase().includes(e.toLowerCase())
        )
      );
    }

    setFilteredMatches(result);
  }, [matches, filters]);

  // Load stored matches on mount
  const loadMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedMatches = await getStoredMatches();
      setMatches(storedMatches);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh matches by recomputing
  const refreshMatches = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const { matches: newMatches, error } = await matchUserToJobs();
      
      if (error) {
        toast({
          title: 'Match Error',
          description: error,
          variant: 'destructive',
        });
        return;
      }

      setMatches(newMatches);
      toast({
        title: 'Matches Updated',
        description: `Found ${newMatches.length} job matches based on your profile.`,
      });
    } catch (error) {
      console.error('Failed to refresh matches:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh job matches. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [toast]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<MatchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Get unique filter options from matches
  const filterOptions = {
    jobTypes: [...new Set(matches.map(m => m.job.jobType).filter(Boolean))],
    locations: [...new Set(matches.map(m => m.job.location).filter(Boolean))],
    experienceLevels: [...new Set(matches.map(m => m.job.experienceLevel).filter(Boolean))],
  };

  return {
    matches: filteredMatches,
    allMatches: matches,
    filters,
    filterOptions,
    isLoading,
    isRefreshing,
    loadMatches,
    refreshMatches,
    updateFilters,
    resetFilters,
  };
}
