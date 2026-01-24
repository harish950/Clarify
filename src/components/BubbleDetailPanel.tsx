import { motion } from 'framer-motion';
import { CareerBubble } from '@/types/career';
import { TrendingUp, Clock, DollarSign, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BubbleDetailPanelProps {
  bubble: CareerBubble | null;
  onClose: () => void;
  isExpanded: boolean;
}

const BubbleDetailPanel = ({ bubble, onClose, isExpanded }: BubbleDetailPanelProps) => {
  if (!bubble) return null;

  return (
    <motion.div
      className="fixed inset-y-0 right-0 w-full max-w-md glass-strong border-l border-border z-50"
      initial={{ x: '100%' }}
      animate={{ x: isExpanded ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div 
              className="w-4 h-4 rounded-full mb-2"
              style={{ backgroundColor: bubble.color }}
            />
            <h2 className="font-display text-2xl font-bold">{bubble.name}</h2>
            <span className="text-sm text-muted-foreground">{bubble.sector}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Fit Score */}
        <div className="glass rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Career Fit</span>
            <span className="font-display text-2xl font-bold text-primary">{bubble.fitScore}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${bubble.color}, hsl(var(--primary)))`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${bubble.fitScore}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass rounded-xl p-4">
            <Clock className="w-5 h-5 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground block">Time to Reach</span>
            <span className="font-display font-bold">{bubble.estimatedMonths} months</span>
          </div>
          <div className="glass rounded-xl p-4">
            <DollarSign className="w-5 h-5 text-muted-foreground mb-2" />
            <span className="text-xs text-muted-foreground block">Salary Range</span>
            <span className="font-display font-bold text-sm">{bubble.salary}</span>
          </div>
          <div className="glass rounded-xl p-4 col-span-2">
            <TrendingUp className="w-5 h-5 text-nebula-green mb-2" />
            <span className="text-xs text-muted-foreground block">Market Demand</span>
            <span className="font-display font-bold text-nebula-green">{bubble.growth}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-6">{bubble.description}</p>

        {/* Skills */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-nebula-green" />
              <span className="text-sm font-medium">Matched Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bubble.matchedSkills.map(skill => (
                <span 
                  key={skill}
                  className="px-3 py-1 rounded-full text-xs bg-nebula-green/20 text-nebula-green border border-nebula-green/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-nebula-orange" />
              <span className="text-sm font-medium">Skills to Develop</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bubble.missingSkills.map(skill => (
                <span 
                  key={skill}
                  className="px-3 py-1 rounded-full text-xs bg-nebula-orange/20 text-nebula-orange border border-nebula-orange/30"
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
            <h3 className="font-display font-semibold mb-3">Roadmap Quests</h3>
            <div className="space-y-2">
              {bubble.subBubbles.map(sub => (
                <motion.div 
                  key={sub.id}
                  className={`glass rounded-xl p-4 cursor-pointer transition-all ${
                    sub.completed ? 'opacity-60' : 'hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      sub.completed ? 'bg-nebula-green/20' : 'bg-muted'
                    }`}>
                      {sub.completed ? (
                        <CheckCircle className="w-4 h-4 text-nebula-green" />
                      ) : (
                        <span className="text-xs">
                          {sub.type === 'skill' && '🎯'}
                          {sub.type === 'project' && '🚀'}
                          {sub.type === 'course' && '📚'}
                          {sub.type === 'interview' && '💬'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium text-sm ${sub.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {sub.name}
                      </span>
                      <span className="text-xs text-muted-foreground block">{sub.description}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6">
          <Button variant="glow" className="w-full" size="lg">
            Start This Path
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BubbleDetailPanel;
