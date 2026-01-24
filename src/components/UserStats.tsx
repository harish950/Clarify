import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Target } from 'lucide-react';

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
    <div className="glass rounded-xl p-4">
      <div className="flex items-center gap-4">
        {/* Level Badge */}
        <div className="relative">
          <motion.div 
            className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="font-display font-bold text-lg">{level}</span>
          </motion.div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-nebula-yellow flex items-center justify-center">
            <Star className="w-3 h-3 text-background" />
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Level {level}</span>
            <span className="text-xs text-muted-foreground">{xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-nebula-green" />
          <span className="text-sm">
            <span className="font-bold">{completedQuests}</span>
            <span className="text-muted-foreground">/{totalQuests} quests</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-nebula-orange" />
          <span className="text-sm">
            <span className="font-bold">5</span>
            <span className="text-muted-foreground"> day streak</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
