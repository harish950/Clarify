import { motion } from 'framer-motion';
import { Flame, Target } from 'lucide-react';

interface UserStatsProps {
  level: number;
  xp: number;
  completedQuests: number;
  totalQuests: number;
}

const UserStats = ({ level, xp, completedQuests, totalQuests }: UserStatsProps) => {
  const xpForNextLevel = level * 500;
  const xpProgress = (xp % 500) / 500 * 100;

  return (
    <div className="surface-elevated rounded-xl p-4">
      <div className="flex items-center gap-3">
        {/* Level Badge */}
        <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
          <span className="font-bold text-background">{level}</span>
        </div>

        {/* XP Progress */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Level {level}</span>
            <span className="text-xs text-muted-foreground">{xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-bubble-success" />
          <span className="text-xs">
            <span className="font-medium">{completedQuests}</span>
            <span className="text-muted-foreground">/{totalQuests}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-bubble-warning" />
          <span className="text-xs">
            <span className="font-medium">5</span>
            <span className="text-muted-foreground"> day streak</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
