import { useState } from 'react';
import { motion } from 'framer-motion';
import { CareerBubble } from '@/types/career';
import { TrendingUp, Clock, DollarSign, AlertCircle, CheckCircle, X, Rocket, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getJobsForCareer } from '@/data/jobsData';
import JobsDialog from './JobsDialog';

interface BubbleDetailPanelProps {
  bubble: CareerBubble | null;
  onClose: () => void;
  isExpanded: boolean;
}

const BubbleDetailPanel = ({ bubble, onClose, isExpanded }: BubbleDetailPanelProps) => {
  const [showJobs, setShowJobs] = useState(false);
  
  if (!bubble) return null;
  
  const jobs = getJobsForCareer(bubble.id);

  return (
    <motion.div
      className="h-full w-full bg-card border-l border-border overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{bubble.name}</h2>
            <span className="text-sm text-muted-foreground">{bubble.sector}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Fit Score */}
        <div className="surface-elevated rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Career Fit</span>
            <span className="text-2xl font-bold text-primary">{bubble.fitScore}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${bubble.fitScore}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="surface-elevated rounded-xl p-4">
            <Clock className="w-4 h-4 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground block">Time to Reach</span>
            <span className="font-semibold">{bubble.estimatedMonths} months</span>
          </div>
          <div className="surface-elevated rounded-xl p-4">
            <DollarSign className="w-4 h-4 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground block">Salary Range</span>
            <span className="font-semibold text-sm">{bubble.salary}</span>
          </div>
          <div className="surface-elevated rounded-xl p-4 col-span-2">
            <TrendingUp className="w-4 h-4 text-bubble-success mb-2" />
            <span className="text-xs text-muted-foreground block">Market Demand</span>
            <span className="font-semibold text-bubble-success">{bubble.growth}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-6">{bubble.description}</p>

        {/* Skills */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-bubble-success" />
              <span className="text-sm font-medium">Matched Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bubble.matchedSkills.map(skill => (
                <span 
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs bg-bubble-success/10 text-bubble-success border border-bubble-success/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-bubble-warning" />
              <span className="text-sm font-medium">Skills to Develop</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bubble.missingSkills.map(skill => (
                <span 
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs bg-bubble-warning/10 text-bubble-warning border border-bubble-warning/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-bubbles / Quests */}
        {bubble.subBubbles && bubble.subBubbles.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Roadmap</h3>
            <div className="space-y-2">
              {bubble.subBubbles.map(sub => (
                <div 
                  key={sub.id}
                  className={`surface-elevated rounded-xl p-3 ${sub.completed ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                      sub.completed ? 'bg-bubble-success/20 text-bubble-success' : 'bg-muted'
                    }`}>
                      {sub.completed ? <CheckCircle className="w-3.5 h-3.5" /> : 
                        sub.type === 'skill' ? '🎯' :
                        sub.type === 'project' ? '🚀' :
                        sub.type === 'course' ? '📚' : '💬'
                      }
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium text-sm ${sub.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {sub.name}
                      </span>
                      <span className="text-xs text-muted-foreground block">{sub.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-2">
          <Button className="w-full gap-2">
            <Rocket className="w-4 h-4" />
            Start This Path
          </Button>
          <Button variant="outline" className="w-full gap-2" onClick={() => setShowJobs(true)}>
            <Eye className="w-4 h-4" />
            View Jobs
          </Button>
        </div>
        
        {/* Jobs Dialog */}
        <JobsDialog
          open={showJobs}
          onOpenChange={setShowJobs}
          jobs={jobs}
          careerName={bubble.name}
        />
      </div>
    </motion.div>
  );
};

export default BubbleDetailPanel;
