export interface CareerBubble {
  id: string;
  name: string;
  sector: string;
  fitScore: number; // 0-100
  distance: number; // 0-100 (effort to reach)
  color: string;
  missingSkills: string[];
  matchedSkills: string[];
  estimatedMonths: number;
  salary: string;
  growth: string;
  description: string;
  subBubbles?: SubBubble[];
  unlocked: boolean;
}

export interface SubBubble {
  id: string;
  name: string;
  type: 'skill' | 'project' | 'interview' | 'course';
  completed: boolean;
  description: string;
}

export interface UserProfile {
  name: string;
  email: string;
  skills: string[];
  interests: string[];
  experience: string;
  education: string;
  careerGoals: string[];
  currentLevel: number;
  xp: number;
  completedQuests: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  rewards: {
    xp: number;
    unlocks?: string[];
  };
  completed: boolean;
  progress: number;
}
