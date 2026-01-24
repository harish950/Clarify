export interface Job {
  job_title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  job_type?: string;
  url: string;
  career_category: string;
}

// Map job categories to career bubble IDs
export const jobCategoryMapping: Record<string, string[]> = {
  'frontend-engineer': ['Software Engineer', 'Frontend', 'Web Developer', 'React', 'JavaScript'],
  'backend-engineer': ['Backend', 'Software Engineer', 'Java', 'Python', 'Node'],
  'fullstack-engineer': ['Full Stack', 'Software Engineer', 'Web Developer'],
  'product-manager': ['Product Manager', 'Product Owner', 'PM'],
  'ux-designer': ['UX', 'UI', 'Designer', 'Design'],
  'data-scientist': ['Data Scientist', 'Data Science', 'Machine Learning', 'ML'],
  'data-analyst': ['Data Analyst', 'Business Analyst', 'Analytics'],
  'ml-engineer': ['Machine Learning', 'ML Engineer', 'AI Engineer', 'Deep Learning'],
  'devops-engineer': ['DevOps', 'SRE', 'Infrastructure', 'Cloud'],
  'mobile-developer': ['Mobile', 'iOS', 'Android', 'React Native'],
  'solutions-architect': ['Architect', 'Solutions', 'Enterprise'],
};

export const masterJobs: Job[] = [
  {
    job_title: "Software Intern (Start ASAP)",
    company: "TetraMem",
    location: "Singapore",
    description: "Support development of tools and applications for neural network models on TetraMem's analog compute-in-memory chips.",
    job_type: "Internship",
    url: "https://sg.prosple.com/graduate-employers/tetramem/jobs-internships/software-intern-0",
    career_category: "ml-engineer"
  },
  {
    job_title: "Software Engineer Intern",
    company: "Thales Singapore",
    location: "Singapore",
    description: "Join Thales Singapore Engineering Competence Centre as a Software Engineer Intern to develop and improve industrialization processes.",
    job_type: "Internship",
    url: "https://sg.prosple.com/graduate-employers/thales-singapore/jobs-internships/software-engineer-intern-2",
    career_category: "backend-engineer"
  },
  {
    job_title: "Frontend Developer",
    company: "TechCorp",
    location: "Singapore",
    salary: "$4,000 - $6,000/month",
    description: "Build responsive web applications using React, TypeScript, and modern CSS frameworks.",
    job_type: "Full-time",
    url: "https://example.com/jobs/frontend-developer",
    career_category: "frontend-engineer"
  },
  {
    job_title: "React Developer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$5,000 - $8,000/month",
    description: "Develop and maintain user-facing features using React.js and related technologies.",
    job_type: "Full-time",
    url: "https://example.com/jobs/react-developer",
    career_category: "frontend-engineer"
  },
  {
    job_title: "Full Stack Engineer",
    company: "InnovateTech",
    location: "Singapore",
    salary: "$6,000 - $10,000/month",
    description: "Build end-to-end web applications with React, Node.js, and PostgreSQL.",
    job_type: "Full-time",
    url: "https://example.com/jobs/fullstack-engineer",
    career_category: "fullstack-engineer"
  },
  {
    job_title: "Backend Engineer",
    company: "DataFlow Inc",
    location: "Singapore",
    salary: "$5,500 - $9,000/month",
    description: "Design and implement scalable backend services and APIs using Node.js and Python.",
    job_type: "Full-time",
    url: "https://example.com/jobs/backend-engineer",
    career_category: "backend-engineer"
  },
  {
    job_title: "Product Manager",
    company: "ProductFirst",
    location: "Singapore",
    salary: "$8,000 - $12,000/month",
    description: "Drive product vision, strategy, and execution for our core platform.",
    job_type: "Full-time",
    url: "https://example.com/jobs/product-manager",
    career_category: "product-manager"
  },
  {
    job_title: "UX Designer",
    company: "DesignStudio",
    location: "Singapore",
    salary: "$4,500 - $7,000/month",
    description: "Create intuitive and delightful user experiences through research and design.",
    job_type: "Full-time",
    url: "https://example.com/jobs/ux-designer",
    career_category: "ux-designer"
  },
  {
    job_title: "Data Scientist",
    company: "AI Labs",
    location: "Singapore",
    salary: "$7,000 - $11,000/month",
    description: "Extract insights from data using statistical methods and machine learning.",
    job_type: "Full-time",
    url: "https://example.com/jobs/data-scientist",
    career_category: "data-scientist"
  },
  {
    job_title: "Data Analyst",
    company: "Analytics Co",
    location: "Singapore",
    salary: "$4,000 - $6,500/month",
    description: "Analyze business data and create actionable insights and dashboards.",
    job_type: "Full-time",
    url: "https://example.com/jobs/data-analyst",
    career_category: "data-analyst"
  },
  {
    job_title: "ML Engineer",
    company: "DeepTech",
    location: "Singapore",
    salary: "$8,000 - $14,000/month",
    description: "Build and deploy machine learning models at scale using TensorFlow and PyTorch.",
    job_type: "Full-time",
    url: "https://example.com/jobs/ml-engineer",
    career_category: "ml-engineer"
  },
  {
    job_title: "DevOps Engineer",
    company: "CloudOps",
    location: "Singapore",
    salary: "$6,000 - $10,000/month",
    description: "Build and maintain CI/CD pipelines and cloud infrastructure on AWS.",
    job_type: "Full-time",
    url: "https://example.com/jobs/devops-engineer",
    career_category: "devops-engineer"
  },
  {
    job_title: "Mobile Developer",
    company: "AppWorks",
    location: "Singapore",
    salary: "$5,000 - $8,000/month",
    description: "Build cross-platform mobile applications using React Native.",
    job_type: "Full-time",
    url: "https://example.com/jobs/mobile-developer",
    career_category: "mobile-developer"
  },
  {
    job_title: "Solutions Architect",
    company: "Enterprise Systems",
    location: "Singapore",
    salary: "$12,000 - $18,000/month",
    description: "Design and oversee implementation of complex enterprise systems.",
    job_type: "Full-time",
    url: "https://example.com/jobs/solutions-architect",
    career_category: "solutions-architect"
  }
];

export const getJobsForCareer = (careerId: string): Job[] => {
  return masterJobs.filter(job => job.career_category === careerId);
};
