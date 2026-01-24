export interface RoadmapStep {
  id: string;
  name: string;
  description: string;
  type: 'skill' | 'project' | 'course' | 'milestone';
  duration: string;
  order: number;
  completed: boolean;
  resources?: { name: string; type: string }[];
}

export interface SavedPath {
  id: string;
  user_id: string;
  career_id: string;
  career_name: string;
  status: 'active' | 'paused' | 'completed';
  roadmap: RoadmapStep[];
  progress_percentage: number;
  started_at: string;
  updated_at: string;
}
