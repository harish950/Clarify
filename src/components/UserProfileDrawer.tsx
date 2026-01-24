import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Target, 
  ChevronRight, 
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Building2,
  MapPin,
  MoreVertical,
  Trash2,
  Send
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { SavedPath } from '@/types/roadmap';
import { AppliedJob, ApplicationStatus } from '@/hooks/useAppliedJobs';
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

interface UserProfileDrawerProps {
  user: any;
  savedPaths: SavedPath[];
  userProfile: any;
  isLoading?: boolean;
  onPathClick?: (path: SavedPath) => void;
  appliedJobs?: AppliedJob[];
  appliedJobsLoading?: boolean;
  onUpdateJobStatus?: (applicationId: string, status: ApplicationStatus) => Promise<boolean>;
  onRemoveJob?: (applicationId: string) => Promise<boolean>;
}

const UserProfileDrawer = ({ 
  user, 
  savedPaths, 
  userProfile, 
  isLoading = false, 
  onPathClick,
  appliedJobs = [],
  appliedJobsLoading = false,
  onUpdateJobStatus,
  onRemoveJob
}: UserProfileDrawerProps) => {

  const displayName = user?.user_metadata?.name || userProfile?.name || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  const skills = userProfile?.parsed_skills || [];
  const interests = userProfile?.interests || [];

  const activePaths = savedPaths.filter(p => p.status === 'active');
  const completedPaths = savedPaths.filter(p => p.status === 'completed');

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* User Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{displayName}</h2>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="surface-elevated rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-primary">{activePaths.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Active Paths</div>
          </div>
          <div className="surface-elevated rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-bubble-success">{completedPaths.length}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Completed</div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Active Paths */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">My Career Paths</h3>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="surface-elevated rounded-lg p-3 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-2 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            ) : savedPaths.length === 0 ? (
              <div className="surface-elevated rounded-lg p-4 text-center">
                <Sparkles className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No paths started yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click on a career bubble and "Start This Path"
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedPaths.map((path) => {
                  const completedSteps = path.roadmap.filter(s => s.completed).length;
                  const totalSteps = path.roadmap.length;
                  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

                  return (
                    <motion.button
                      key={path.id}
                      onClick={() => onPathClick?.(path)}
                      className="w-full surface-elevated rounded-lg p-3 text-left hover:bg-accent/50 transition-colors group"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {path.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-bubble-success flex-shrink-0" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                            <span className="font-medium text-sm truncate">{path.career_name}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {completedSteps}/{totalSteps} steps
                        </span>
                        {path.status === 'active' && (
                          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            In Progress
                          </span>
                        )}
                        {path.status === 'completed' && (
                          <span className="px-1.5 py-0.5 rounded bg-bubble-success/10 text-bubble-success font-medium">
                            Completed
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">My Skills</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 8).map((skill: string) => (
                  <span 
                    key={skill}
                    className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                    +{skills.length - 8} more
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Interests</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((interest: string) => (
                  <span 
                    key={interest}
                    className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Applied Jobs Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Applied Jobs</h3>
              {appliedJobs.length > 0 && (
                <Badge variant="secondary" className="text-xs ml-auto">
                  {appliedJobs.length}
                </Badge>
              )}
            </div>

            {appliedJobsLoading ? (
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="surface-elevated rounded-lg p-3 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-2 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            ) : appliedJobs.length === 0 ? (
              <div className="surface-elevated rounded-lg p-4 text-center">
                <Briefcase className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No applications yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Apply to jobs to track them here
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {appliedJobs.map((application) => (
                    <motion.div
                      key={application.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="surface-elevated rounded-lg p-3 border border-border/50 hover:border-border transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {application.job?.title || 'Unknown Job'}
                          </h4>
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
                              onClick={() => onRemoveJob?.(application.id)}
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
                          onValueChange={(value) => onUpdateJobStatus?.(application.id, value as ApplicationStatus)}
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
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserProfileDrawer;
