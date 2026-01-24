import { motion } from 'framer-motion';
import { Filter, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MatchFilters } from '@/types/matching';

interface MatchFiltersProps {
  filters: MatchFilters;
  filterOptions: {
    jobTypes: string[];
    locations: string[];
    experienceLevels: string[];
  };
  onUpdateFilters: (filters: Partial<MatchFilters>) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  matchCount: number;
  totalCount: number;
}

export function MatchFiltersPanel({
  filters,
  filterOptions,
  onUpdateFilters,
  onResetFilters,
  onRefresh,
  isRefreshing,
  matchCount,
  totalCount,
}: MatchFiltersProps) {
  const hasActiveFilters = 
    filters.minScore > 0 ||
    filters.jobType.length > 0 ||
    filters.location.length > 0 ||
    filters.experienceLevel.length > 0;

  const toggleFilter = (type: 'jobType' | 'location' | 'experienceLevel', value: string) => {
    const current = filters[type];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onUpdateFilters({ [type]: updated });
  };

  return (
    <motion.div
      className="surface-elevated rounded-xl p-4 space-y-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm">Filters</span>
          <Badge variant="secondary" className="text-xs">
            {matchCount} of {totalCount} jobs
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onResetFilters} className="h-7 text-xs">
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isRefreshing}
            className="h-7 text-xs"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Minimum Score Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Minimum Match Score</span>
          <span className="font-medium">{filters.minScore}%</span>
        </div>
        <Slider
          value={[filters.minScore]}
          onValueChange={([value]) => onUpdateFilters({ minScore: value })}
          min={0}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Job Type Filter */}
      {filterOptions.jobTypes.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Job Type</span>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.jobTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleFilter('jobType', type)}
                className={`px-2 py-1 rounded-full text-xs transition-all border ${
                  filters.jobType.includes(type)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Filter */}
      {filterOptions.locations.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Location</span>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.locations.slice(0, 6).map(loc => (
              <button
                key={loc}
                onClick={() => toggleFilter('location', loc)}
                className={`px-2 py-1 rounded-full text-xs transition-all border ${
                  filters.location.includes(loc)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Experience Level Filter */}
      {filterOptions.experienceLevels.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Experience Level</span>
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.experienceLevels.map(level => (
              <button
                key={level}
                onClick={() => toggleFilter('experienceLevel', level)}
                className={`px-2 py-1 rounded-full text-xs transition-all border ${
                  filters.experienceLevel.includes(level)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
