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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{
        left: mousePosition.x + 16,
        top: mousePosition.y - 8,
      }}
    >
      <div className="bg-card border border-border shadow-lg rounded-xl p-3 min-w-[180px]">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">{bubble.name}</span>
        </div>
        
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fit Score</span>
            <span className="font-medium text-primary">{bubble.fitScore}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time to Reach</span>
            <span className="font-medium">{bubble.estimatedMonths} mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Skills Gap</span>
            <span className="font-medium text-bubble-warning">{bubble.missingSkills.length}</span>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-border text-[10px] text-muted-foreground">
          Click for details
        </div>
      </div>
    </motion.div>
  );
};

export default BubbleTooltip;
