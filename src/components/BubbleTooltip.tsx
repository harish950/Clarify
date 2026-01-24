import { motion } from 'framer-motion';
import { CareerBubble } from '@/types/career';

interface BubbleTooltipProps {
  bubble: CareerBubble | null;
  mousePosition: { x: number; y: number };
}

const BubbleTooltip = ({ bubble, mousePosition }: BubbleTooltipProps) => {
  if (!bubble) return null;

  return (
    <motion.div
      className="fixed z-50 pointer-events-none"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        left: mousePosition.x + 20,
        top: mousePosition.y - 10,
      }}
    >
      <div className="glass-strong rounded-xl p-4 min-w-[200px] max-w-[280px]">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: bubble.color }}
          />
          <span className="font-display font-bold">{bubble.name}</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fit Score</span>
            <span className="font-semibold text-primary">{bubble.fitScore}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time to Reach</span>
            <span className="font-semibold">{bubble.estimatedMonths} months</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Missing Skills</span>
            <span className="font-semibold text-nebula-orange">{bubble.missingSkills.length}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          Click to explore roadmap
        </div>
      </div>
    </motion.div>
  );
};

export default BubbleTooltip;
