import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Briefcase, DollarSign, Check, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface JobListing {
  id: string;
  title: string;
  company: string | null;
  location: string | null;
  salary?: string | null;
  description?: string | null;
  job_type?: string | null;
}

interface JobsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobs: JobListing[];
  careerName: string;
  onApplyToJob?: (jobId: string) => Promise<boolean>;
  isJobApplied?: (jobId: string) => boolean;
}

const JobsDialog = ({ open, onOpenChange, jobs, careerName, onApplyToJob, isJobApplied }: JobsDialogProps) => {
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  const handleApply = async (job: JobListing) => {
    if (!onApplyToJob) return;
    
    setApplyingJobId(job.id);
    await onApplyToJob(job.id);
    setApplyingJobId(null);
  };

  const checkIfApplied = (job: JobListing): boolean => {
    if (!isJobApplied) return false;
    return isJobApplied(job.id);
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
              {jobs.map((job) => {
                const applied = checkIfApplied(job);
                const isApplying = applyingJobId === job.id;
                
                return (
                  <div
                    key={job.id}
                    className="surface-elevated rounded-xl p-4 border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{job.title}</h3>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                          {job.company && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              {job.company}
                            </span>
                          )}
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {job.location}
                            </span>
                          )}
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
                        
                        {job.description && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {job.description}
                          </p>
                        )}
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
                          variant="default"
                          className="shrink-0 gap-1.5"
                          onClick={() => handleApply(job)}
                          disabled={isApplying}
                        >
                          {isApplying ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          {isApplying ? 'Applying...' : 'Apply'}
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
