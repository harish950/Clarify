import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Job } from '@/data/jobsData';
import { MapPin, Building2, Briefcase, DollarSign, ExternalLink, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface JobsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobs: Job[];
  careerName: string;
  onApplyToJob?: (jobId: string) => Promise<boolean>;
  isJobApplied?: (jobId: string) => boolean;
}

const JobsDialog = ({ open, onOpenChange, jobs, careerName, onApplyToJob, isJobApplied }: JobsDialogProps) => {
  const handleApply = async (job: Job, index: number) => {
    // First, open the external link
    if (job.url) {
      window.open(job.url, '_blank');
    }
    
    // Track application using a synthetic ID based on career and index
    // In a real app, jobs would have database IDs
    if (onApplyToJob) {
      const syntheticId = `${careerName.toLowerCase().replace(/\s+/g, '-')}-${index}`;
      await onApplyToJob(syntheticId);
    }
  };

  const checkIfApplied = (job: Job, index: number): boolean => {
    if (!isJobApplied) return false;
    const syntheticId = `${careerName.toLowerCase().replace(/\s+/g, '-')}-${index}`;
    return isJobApplied(syntheticId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {careerName} Jobs
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({jobs.length} available)
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {jobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No jobs available for this career path yet.</p>
              <p className="text-sm mt-2">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => {
                const applied = checkIfApplied(job, index);
                
                return (
                  <div
                    key={`job-${index}`}
                    className="surface-elevated rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{job.job_title}</h3>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </span>
                          {job.job_type && (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5" />
                              {job.job_type}
                            </span>
                          )}
                        </div>
                        
                        {job.salary && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-primary font-medium">
                            <DollarSign className="w-3.5 h-3.5" />
                            {job.salary}
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                          {job.description}
                        </p>
                      </div>
                      
                      {applied ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0 gap-1.5"
                          disabled
                        >
                          <Check className="w-3.5 h-3.5" />
                          Applied
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 gap-1.5"
                          onClick={() => handleApply(job, index)}
                        >
                          Apply
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default JobsDialog;
