import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Upload, ArrowRight, ArrowLeft, Linkedin, FileText, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

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
  });

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

  return (
    <div className="min-h-screen bg-nebula relative overflow-hidden flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />
      <motion.div 
        className="fixed w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl pointer-events-none"
        style={{ top: '-20%', right: '-10%' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Logo */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-foreground" />
        </div>
        <span className="font-display text-xl font-bold">Career Nebula</span>
      </Link>

      {/* Auth Card */}
      <motion.div 
        className="w-full max-w-lg glass-strong rounded-3xl p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress indicator for signup */}
        {mode === 'signup' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'bg-primary w-8' : 'bg-muted w-2'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
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
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-display text-3xl font-bold text-center mb-2">Welcome Back</h1>
              <p className="text-muted-foreground text-center mb-8">Sign in to continue your journey</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12 bg-muted/50 border-border"
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
                    className="h-12 bg-muted/50 border-border"
                  />
                </div>
                <Button type="submit" variant="glow" className="w-full" size="lg">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')} 
                  className="text-primary hover:underline font-medium"
                >
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
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <>
                  <h1 className="font-display text-3xl font-bold text-center mb-2">Create Account</h1>
                  <p className="text-muted-foreground text-center mb-8">Start your career exploration</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="h-12 bg-muted/50 border-border"
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
                        className="h-12 bg-muted/50 border-border"
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
                        className="h-12 bg-muted/50 border-border"
                      />
                    </div>
                    <Button type="submit" variant="glow" className="w-full" size="lg">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className="font-display text-3xl font-bold text-center mb-2">Upload Your Profile</h1>
                  <p className="text-muted-foreground text-center mb-8">Help us understand your background</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Label>Resume (Required)</Label>
                      <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                        />
                        {formData.resume ? (
                          <div className="flex flex-col items-center gap-2 text-primary">
                            <CheckCircle className="w-10 h-10" />
                            <span className="text-sm font-medium">{formData.resume.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileText className="w-10 h-10" />
                            <span className="text-sm">Drop your resume or click to upload</span>
                            <span className="text-xs">PDF, DOC, DOCX</span>
                          </div>
                        )}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4" /> LinkedIn URL (Optional)
                      </Label>
                      <Input 
                        id="linkedin" 
                        placeholder="linkedin.com/in/yourprofile"
                        value={formData.linkedin}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="h-12 bg-muted/50 border-border"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="glass" className="flex-1" size="lg" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button type="submit" variant="glow" className="flex-1" size="lg">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {step === 3 && (
                <>
                  <h1 className="font-display text-3xl font-bold text-center mb-2">Your Interests & Skills</h1>
                  <p className="text-muted-foreground text-center mb-8">Select all that apply</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label>Career Interests</Label>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map(interest => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              formData.interests.includes(interest)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Current Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {skillOptions.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-4 py-2 rounded-full text-sm transition-all ${
                              formData.skills.includes(skill)
                                ? 'bg-secondary text-secondary-foreground'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="glass" className="flex-1" size="lg" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button type="submit" variant="glow" className="flex-1" size="lg">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {step === 4 && (
                <>
                  <h1 className="font-display text-3xl font-bold text-center mb-2">Career Goals</h1>
                  <p className="text-muted-foreground text-center mb-8">Tell us about your aspirations</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <select 
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                        className="w-full h-12 px-4 rounded-lg bg-muted/50 border border-border text-foreground"
                      >
                        <option value="">Select your level</option>
                        <option value="student">Student / Recent Graduate</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (2-5 years)</option>
                        <option value="senior">Senior Level (5+ years)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goals">What are your career goals?</Label>
                      <Textarea 
                        id="goals" 
                        placeholder="E.g., I want to become a senior software engineer at a top tech company within 3 years..."
                        value={formData.careerGoals}
                        onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                        className="min-h-[120px] bg-muted/50 border-border resize-none"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="glass" className="flex-1" size="lg" onClick={() => setStep(step - 1)}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                      <Button type="submit" variant="hero" className="flex-1" size="lg">
                        <Sparkles className="w-4 h-4" />
                        Launch My Universe
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {step === 1 && (
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{' '}
                  <button 
                    onClick={() => setMode('login')} 
                    className="text-primary hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
