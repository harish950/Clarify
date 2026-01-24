import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Briefcase, Building2, MapPin, Clock, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppliedJob, ApplicationStatus, useAppliedJobs } from '@/hooks/useAppliedJobs';
import { formatDistanceToNow } from 'date-fns';

const statusColors: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  interviewing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  offered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  withdrawn: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const statusLabels: Record<ApplicationStatus, string> = {
  applied: 'Applied',
  interviewing: 'Interviewing',
  offered: 'Offered',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

interface AppliedJobsPanelProps {
  appliedJobs: AppliedJob[];
  isLoading: boolean;
  onUpdateStatus: (applicationId: string, status: ApplicationStatus) => Promise<boolean>;
  onRemove: (applicationId: string) => Promise<boolean>;
}

const AppliedJobsPanel = ({ appliedJobs, isLoading, onUpdateStatus, onRemove }: AppliedJobsPanelProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const groupedJobs = appliedJobs.reduce((acc, job) => {
    if (!acc[job.status]) acc[job.status] = [];
    acc[job.status].push(job);
    return acc;
  }, {} as Record<ApplicationStatus, AppliedJob[]>);

  return (
    <motion.div
      className="fixed left-0 top-0 h-full z-20 flex"
      initial={false}
      animate={{ width: isCollapsed ? 48 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Panel content */}
      <div className={`h-full bg-card/95 backdrop-blur-md border-r border-border flex flex-col ${isCollapsed ? 'w-12' : 'w-80'}`}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Applied Jobs</h2>
              <Badge variant="secondary" className="text-xs">
                {appliedJobs.length}
              </Badge>
            </div>
          )}
          {isCollapsed && (
            <Briefcase className="w-5 h-5 text-primary mx-auto" />
          )}
        </div>

        {/* Content */}
        {!isCollapsed && (
          <ScrollArea className="flex-1 px-3 py-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : appliedJobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No applications yet</p>
                <p className="text-xs mt-1">Apply to jobs to track them here</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {appliedJobs.map((application) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-background/50 rounded-lg p-3 border border-border/50 hover:border-border transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground truncate">
                            {application.job?.title || 'Unknown Job'}
                          </h3>
                          {application.job?.company && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate">{application.job.company}</span>
                            </div>
                          )}
                          {application.job?.location && (
                            <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{application.job.location}</span>
                            </div>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => onRemove(application.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex items-center justify-between mt-2 gap-2">
                        <Select
                          value={application.status}
                          onValueChange={(value) => onUpdateStatus(application.id, value as ApplicationStatus)}
                        >
                          <SelectTrigger className={`h-7 text-xs w-auto px-2 border ${statusColors[application.status]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value} className="text-xs">
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </ScrollArea>
        )}

        {/* Collapsed state - show count */}
        {isCollapsed && !isLoading && appliedJobs.length > 0 && (
          <div className="flex-1 flex flex-col items-center pt-4 gap-2">
            <Badge variant="secondary" className="text-xs">
              {appliedJobs.length}
            </Badge>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-md border border-border"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </Button>
    </motion.div>
  );
};

export default AppliedJobsPanel;
