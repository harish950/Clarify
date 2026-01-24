import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RoadmapStep } from '@/types/roadmap';
import { 
  CheckCircle2, 
  Circle, 
  Target, 
  Rocket, 
  BookOpen, 
  Award,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock
} from 'lucide-react';

interface RoadmapDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  careerName: string;
  roadmap: RoadmapStep[];
  isLoading?: boolean;
  onStepComplete?: (stepId: string, completed: boolean) => void;
}

const stepIcons = {
  skill: Target,
  project: Rocket,
  course: BookOpen,
  milestone: Award,
};

const stepColors = {
  skill: 'text-primary',
  project: 'text-bubble-success',
  course: 'text-blue-500',
  milestone: 'text-yellow-500',
};

const RoadmapDrawer = ({ 
  open, 
  onOpenChange, 
  careerName, 
  roadmap, 
  isLoading,
  onStepComplete 
}: RoadmapDrawerProps) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  
  const completedSteps = roadmap.filter(s => s.completed).length;
  const progressPercentage = roadmap.length > 0 ? (completedSteps / roadmap.length) * 100 : 0;

  const toggleExpand = (stepId: string) => {
    setExpandedStep(prev => prev === stepId ? null : stepId);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4 border-b border-border">
          <SheetTitle className="text-xl">Your Path to {careerName}</SheetTitle>
          <SheetDescription>
            A personalized roadmap based on your skills and experience
          </SheetDescription>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {completedSteps} of {roadmap.length} steps completed
              </span>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Rocket className="w-8 h-8 text-primary" />
                </motion.div>
                <p className="text-muted-foreground">Generating your personalized roadmap...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {roadmap.map((step, index) => {
                  const Icon = stepIcons[step.type] || Target;
                  const isExpanded = expandedStep === step.id;
                  const isCompleted = step.completed;
                  
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`surface-elevated rounded-xl overflow-hidden ${
                        isCompleted ? 'opacity-60' : ''
                      }`}
                    >
                      <button
                        onClick={() => toggleExpand(step.id)}
                        className="w-full p-4 flex items-start gap-3 text-left hover:bg-accent/50 transition-colors"
                      >
                        {/* Step number / completion */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted 
                            ? 'bg-bubble-success/20 text-bubble-success' 
                            : 'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className={`w-4 h-4 ${stepColors[step.type]}`} />
                            <span className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {step.name}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {step.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 pt-0 border-t border-border/50">
                              <div className="pt-3 space-y-3">
                                <p className="text-sm text-muted-foreground">
                                  {step.description}
                                </p>
                                
                                {/* Resources */}
                                {step.resources && step.resources.length > 0 && (
                                  <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2">
                                      RECOMMENDED RESOURCES
                                    </h4>
                                    <div className="space-y-2">
                                      {step.resources.map((resource, i) => (
                                        <div 
                                          key={i}
                                          className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50"
                                        >
                                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                          <span>{resource.name}</span>
                                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-background">
                                            {resource.type}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {/* Toggle complete button */}
                                {onStepComplete && (
                                  <Button 
                                    size="sm" 
                                    variant={isCompleted ? "secondary" : "outline"}
                                    className="w-full gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onStepComplete(step.id, !isCompleted);
                                    }}
                                  >
                                    {isCompleted ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3" />
                                        Mark as Incomplete
                                      </>
                                    ) : (
                                      <>
                                        <Circle className="w-3 h-3" />
                                        Mark as Complete
                                      </>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default RoadmapDrawer;
