import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CareerBubble } from '@/types/career';
import { JobMatch } from '@/types/matching';
import { RoadmapStep } from '@/types/roadmap';
import { TrendingUp, Clock, DollarSign, AlertCircle, CheckCircle, X, Rocket, Eye, Target, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getJobsForCareer } from '@/data/jobsData';
import JobsDialog from './JobsDialog';
import { MatchExplainability } from './MatchExplainability';
import RoadmapDrawer from './RoadmapDrawer';
import { useSavedPaths } from '@/hooks/useSavedPaths';

interface BubbleDetailPanelProps {
  bubble: CareerBubble | null;
  onClose: () => void;
  isExpanded: boolean;
  matchData?: JobMatch | null;
}

const BubbleDetailPanel = ({ bubble, onClose, isExpanded, matchData }: BubbleDetailPanelProps) => {
  const [showJobs, setShowJobs] = useState(false);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [currentRoadmap, setCurrentRoadmap] = useState<RoadmapStep[]>([]);
  const [currentPathId, setCurrentPathId] = useState<string | null>(null);
  
  const { isLoading, startPath, updateStepCompletion, getSavedPath } = useSavedPaths();
  
  if (!bubble) return null;
  
  const jobs = getJobsForCareer(bubble.id);
  const hasMatchData = matchData && matchData.weightedScore > 0;
  
  // Get missing and matched skills for roadmap generation
  const missingSkills = hasMatchData ? matchData.missingSkills : bubble.missingSkills;
  const matchedSkills = hasMatchData ? matchData.matchedSkills : bubble.matchedSkills;

  const handleStartPath = async () => {
    // First check if path already exists
    const existingPath = await getSavedPath(bubble.id);
    
    if (existingPath) {
      // Path already exists, just show the roadmap
      setCurrentRoadmap(existingPath.roadmap);
      setCurrentPathId(existingPath.id);
      setShowRoadmap(true);
      return;
    }
    
    // Generate new roadmap
    setShowRoadmap(true);
    const result = await startPath(
      bubble.id,
      bubble.name,
      missingSkills,
      matchedSkills
    );
    
    if (result) {
      setCurrentRoadmap(result.roadmap);
      setCurrentPathId(result.savedPath.id);
    }
  };

  const handleStepComplete = async (stepId: string) => {
    if (!currentPathId) return;
    
    await updateStepCompletion(currentPathId, stepId, true);
    
    // Update local state
    setCurrentRoadmap(prev => prev.map(step => 
      step.id === stepId ? { ...step, completed: true } : step
    ));
  };

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

        {/* Fit Score - Use match data if available */}
        <div className="surface-elevated rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              {hasMatchData ? 'AI Match Score' : 'Career Fit'}
            </span>
            <span className="text-2xl font-bold text-primary">
              {hasMatchData ? Math.round(matchData.weightedScore * 100) : bubble.fitScore}%
            </span>
          </div>
          <Progress 
            value={hasMatchData ? matchData.weightedScore * 100 : bubble.fitScore} 
            className="h-2"
          />
          
          {/* Score breakdown for matched jobs */}
          {hasMatchData && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Target className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{Math.round(matchData.skillsScore * 100)}%</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Skills</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{Math.round(matchData.experienceScore * 100)}%</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Experience</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">{Math.round(matchData.interestsScore * 100)}%</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Interests</span>
              </div>
            </div>
          )}
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

        {/* Skills - Use match data if available */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-bubble-success" />
              <span className="text-sm font-medium">Matched Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(hasMatchData ? matchData.matchedSkills : bubble.matchedSkills).map(skill => (
                <span 
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs bg-bubble-success/10 text-bubble-success border border-bubble-success/20"
                >
                  {skill}
                </span>
              ))}
              {(hasMatchData ? matchData.matchedSkills : bubble.matchedSkills).length === 0 && (
                <span className="text-xs text-muted-foreground">No matched skills yet</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-bubble-warning" />
              <span className="text-sm font-medium">Skills to Develop</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(hasMatchData ? matchData.missingSkills : bubble.missingSkills).map(skill => (
                <span 
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-xs bg-bubble-warning/10 text-bubble-warning border border-bubble-warning/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Strength and improvement areas from AI matching */}
          {hasMatchData && matchData.strengthAreas.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Your Strengths</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {matchData.strengthAreas.map((area, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
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
          <Button 
            className="w-full gap-2" 
            onClick={handleStartPath}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Rocket className="w-4 h-4" />
            )}
            {isLoading ? 'Generating...' : 'Start This Path'}
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
        
        {/* Roadmap Drawer */}
        <RoadmapDrawer
          open={showRoadmap}
          onOpenChange={setShowRoadmap}
          careerName={bubble.name}
          roadmap={currentRoadmap}
          isLoading={isLoading && currentRoadmap.length === 0}
          onStepComplete={handleStepComplete}
        />
      </div>
    </motion.div>
  );
};

export default BubbleDetailPanel;
