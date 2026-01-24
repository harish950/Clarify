import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, Linkedin, FileText, CheckCircle, Plus, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    resume: null as File | null,
    linkedin: '',
    interests: [] as string[],
    skills: [] as string[],
    careerGoals: '',
    experience: '',
    workEnvironment: '',
    salaryRange: '',
    helpWith: [] as string[],
    currentGoal: '',
  });
  const [customInterest, setCustomInterest] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const totalSteps = 4;

  const interestOptions = [
    'Technology', 'Finance', 'Healthcare', 'Marketing', 'Design', 
    'Data Science', 'AI/ML', 'Product Management', 'Consulting', 'Startups'
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'SQL', 'Data Analysis', 
    'Communication', 'Leadership', 'Project Management', 'Design', 'Writing'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      navigate('/dashboard');
    } else if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const addCustomInterest = () => {
    const trimmed = customInterest.trim();
    if (trimmed && trimmed.length <= 50 && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmed]
      }));
      setCustomInterest('');
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && trimmed.length <= 50 && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
      setCustomSkill('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center p-6">
      <motion.div 
        className="w-full max-w-md surface-elevated rounded-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Progress indicator for signup */}
        {mode === 'signup' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'bg-primary w-8' : 'bg-border w-2'
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-2xl font-bold text-center mb-1">Welcome back</h1>
              <p className="text-muted-foreground text-center mb-8 text-sm">Sign in to continue</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <Button type="submit" className="w-full gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">
                  Get started
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`signup-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && (
                <>
                  <h1 className="text-2xl font-bold text-center mb-1">Create account</h1>
                  <p className="text-muted-foreground text-center mb-8 text-sm">Start your career exploration</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="w-full gap-2">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="text-2xl font-bold text-center mb-1">Upload your profile</h1>
                  <p className="text-muted-foreground text-center mb-8 text-sm">Help us understand your background</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <Label>Resume (Required)</Label>
                      <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                        />
                        {formData.resume ? (
                          <div className="flex flex-col items-center gap-2 text-primary">
                            <CheckCircle className="w-8 h-8" />
                            <span className="text-sm font-medium">{formData.resume.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileText className="w-8 h-8" />
                            <span className="text-sm">Drop resume or click to upload</span>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" /> LinkedIn (Optional)
                      </Label>
                      <Input 
                        id="linkedin" 
                        placeholder="linkedin.com/in/yourprofile"
                        value={formData.linkedin}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 gap-2">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {step === 3 && (
                <>
                  <h1 className="text-2xl font-bold text-center mb-1">Interests & Skills</h1>
                  <p className="text-muted-foreground text-center mb-8 text-sm">Select all that apply</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <Label>Career Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set([...interestOptions, ...formData.interests])].map(interest => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all border flex items-center gap-1 ${
                              formData.interests.includes(interest)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                            }`}
                          >
                            {interest}
                            {formData.interests.includes(interest) && !interestOptions.includes(interest) && (
                              <X className="w-3 h-3" />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom interest..."
                          value={customInterest}
                          onChange={(e) => setCustomInterest(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                          maxLength={50}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="icon" onClick={addCustomInterest} disabled={!customInterest.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Current Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set([...skillOptions, ...formData.skills])].map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all border flex items-center gap-1 ${
                              formData.skills.includes(skill)
                                ? 'bg-accent text-accent-foreground border-accent'
                                : 'bg-background text-muted-foreground border-border hover:border-accent/50'
                            }`}
                          >
                            {skill}
                            {formData.skills.includes(skill) && !skillOptions.includes(skill) && (
                              <X className="w-3 h-3" />
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add custom skill..."
                          value={customSkill}
                          onChange={(e) => setCustomSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                          maxLength={50}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="icon" onClick={addCustomSkill} disabled={!customSkill.trim()}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 gap-2">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {step === 4 && (
                <>
                  <h1 className="text-2xl font-bold text-center mb-1">Career goals</h1>
                  <p className="text-muted-foreground text-center mb-8 text-sm">Tell us about your aspirations</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <select 
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg bg-background border border-input text-foreground text-sm"
                      >
                        <option value="">Select your level</option>
                        <option value="student">Student / Recent Graduate</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (2-5 years)</option>
                        <option value="senior">Senior Level (5+ years)</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Label>Preferred work environment?</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Remote', 'Hybrid', 'On-site', 'Flexible'].map(env => (
                          <button
                            key={env}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, workEnvironment: env }))}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                              formData.workEnvironment === env
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                            }`}
                          >
                            {env}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Expected salary range</Label>
                      <div className="flex flex-wrap gap-2">
                        {['< $3k', '$3k – $5k', '$5k – $8k', '$8k+'].map(salary => (
                          <button
                            key={salary}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, salaryRange: salary }))}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                              formData.salaryRange === salary
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                            }`}
                          >
                            {salary}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>What do you want help with most?</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Finding roles', 'Improving skills', 'Building roadmap', 'Interview prep', 'Networking'].map(help => (
                          <button
                            key={help}
                            type="button"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              helpWith: prev.helpWith.includes(help)
                                ? prev.helpWith.filter(h => h !== help)
                                : [...prev.helpWith, help]
                            }))}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                              formData.helpWith.includes(help)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                            }`}
                          >
                            {help}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>What best describes your current goal?</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Get my first job', 'Switch industries', 'Level up in my current field', 'Explore options', 'Prepare for leadership roles'].map(goal => (
                          <button
                            key={goal}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, currentGoal: goal }))}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all border ${
                              formData.currentGoal === goal
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                            }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 gap-2">
                        Launch
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {step === 1 && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{' '}
                  <button onClick={() => setMode('login')} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
