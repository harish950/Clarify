import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Zap, Target, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { JobMatch } from '@/types/matching';

interface MatchExplainabilityProps {
  match: JobMatch;
}

export function MatchExplainability({ match }: MatchExplainabilityProps) {
  const scorePercent = Math.round(match.weightedScore * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-bubble-success';
    if (score >= 0.4) return 'text-bubble-warning';
    return 'text-muted-foreground';
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.7) return 'bg-bubble-success';
    if (score >= 0.4) return 'bg-bubble-warning';
    return 'bg-muted';
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {/* Overall Score */}
      <div className="surface-elevated rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Match Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(match.weightedScore)}`}>
            {scorePercent}%
          </span>
        </div>
        <Progress value={scorePercent} className="h-2" />
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-3 gap-2">
        <div className="surface-elevated rounded-lg p-3 text-center">
          <Target className={`w-4 h-4 mx-auto mb-1 ${getScoreColor(match.skillsScore)}`} />
          <div className={`text-lg font-bold ${getScoreColor(match.skillsScore)}`}>
            {Math.round(match.skillsScore * 100)}%
          </div>
          <div className="text-[10px] text-muted-foreground">Skills (50%)</div>
        </div>
        <div className="surface-elevated rounded-lg p-3 text-center">
          <TrendingUp className={`w-4 h-4 mx-auto mb-1 ${getScoreColor(match.experienceScore)}`} />
          <div className={`text-lg font-bold ${getScoreColor(match.experienceScore)}`}>
            {Math.round(match.experienceScore * 100)}%
          </div>
          <div className="text-[10px] text-muted-foreground">Experience (30%)</div>
        </div>
        <div className="surface-elevated rounded-lg p-3 text-center">
          <Zap className={`w-4 h-4 mx-auto mb-1 ${getScoreColor(match.interestsScore)}`} />
          <div className={`text-lg font-bold ${getScoreColor(match.interestsScore)}`}>
            {Math.round(match.interestsScore * 100)}%
          </div>
          <div className="text-[10px] text-muted-foreground">Interests (20%)</div>
        </div>
      </div>

      {/* Strength Areas */}
      {match.strengthAreas.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-bubble-success" />
            <span className="text-sm font-medium">Strengths</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {match.strengthAreas.map((area, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-xs bg-bubble-success/10 text-bubble-success border border-bubble-success/20"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Areas */}
      {match.improvementAreas.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-bubble-warning" />
            <span className="text-sm font-medium">Areas to Develop</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {match.improvementAreas.map((area, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-xs bg-bubble-warning/10 text-bubble-warning border border-bubble-warning/20"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matched Skills */}
      {match.matchedSkills.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Matched Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {match.matchedSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {match.missingSkills.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium">Skills to Learn</span>
          <div className="flex flex-wrap gap-1.5">
            {match.missingSkills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground border border-border"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
