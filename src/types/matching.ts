export interface JobMatch {
  jobId: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    jobType: string;
    salary: string;
    description: string;
    requiredSkills: string[];
    experienceLevel: string;
    sourceUrl: string;
  };
  skillsScore: number;
  experienceScore: number;
  interestsScore: number;
  weightedScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface MatchFilters {
  minScore: number;
  jobType: string[];
  location: string[];
  experienceLevel: string[];
  salaryRange: { min: number; max: number } | null;
}

export interface UserProfileData {
  name?: string;
  email?: string;
  resumeText?: string;
  linkedinUrl?: string;
  skills: string[];
  interests: string[];
  experience?: string;
  workEnvironment?: string;
  salaryRange?: string;
  careerGoals?: string[];
}
