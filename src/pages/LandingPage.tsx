import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-nebula relative overflow-hidden">
      {/* Animated stars background */}
      <div className="fixed inset-0 stars-bg opacity-50 pointer-events-none" />
      
      {/* Floating orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div 
          className="absolute w-80 h-80 rounded-full bg-secondary/20 blur-3xl"
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ top: '50%', right: '5%' }}
        />
        <motion.div 
          className="absolute w-64 h-64 rounded-full bg-nebula-pink/15 blur-3xl"
          animate={{ 
            x: [0, 60, 0], 
            y: [0, -60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ bottom: '10%', left: '30%' }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-foreground" />
          </div>
          <span className="font-display text-xl font-bold">Career Nebula</span>
        </motion.div>

        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link to="/auth">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button variant="glow" size="sm">Get Started</Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
              <Zap className="w-4 h-4 text-primary" />
              Visualize your career journey like never before
            </span>
          </motion.div>

          <motion.h1 
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Navigate Your{' '}
            <span className="text-gradient-glow">Career Universe</span>
          </motion.h1>

          <motion.p 
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Stop browsing job boards. Start exploring an interactive galaxy of career opportunities 
            tailored to your skills, interests, and ambitions.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl" className="group">
                Launch Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="glass" size="xl">
                Explore Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mt-32 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <FeatureCard 
            icon={<Target className="w-6 h-6" />}
            title="Personalized Career Map"
            description="Upload your resume and get an interactive visualization of roles perfectly matched to your profile."
            color="primary"
          />
          <FeatureCard 
            icon={<Sparkles className="w-6 h-6" />}
            title="Skill Gap Analysis"
            description="See exactly what skills you need and how long it takes to reach your dream role."
            color="secondary"
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6" />}
            title="Actionable Roadmaps"
            description="Turn insights into action with personalized learning paths and project recommendations."
            color="accent"
          />
        </motion.div>

        {/* Interactive Preview */}
        <motion.div 
          className="mt-32 relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="glass-strong rounded-2xl p-8 relative overflow-hidden">
            <div className="aspect-video bg-muted/30 rounded-xl flex items-center justify-center relative">
              {/* Mini bubble visualization preview */}
              <div className="relative w-full h-full">
                {/* Center node */}
                <motion.div 
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary z-10"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="font-display font-bold text-sm">ME</span>
                </motion.div>

                {/* Orbiting bubbles */}
                {[
                  { name: 'SWE', color: 'from-primary to-primary/70', size: 'w-14 h-14', orbit: 120, delay: 0 },
                  { name: 'DS', color: 'from-secondary to-secondary/70', size: 'w-12 h-12', orbit: 160, delay: 2 },
                  { name: 'PM', color: 'from-nebula-pink to-nebula-pink/70', size: 'w-10 h-10', orbit: 200, delay: 4 },
                  { name: 'UX', color: 'from-nebula-cyan to-nebula-cyan/70', size: 'w-11 h-11', orbit: 180, delay: 6 },
                ].map((bubble, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear", delay: bubble.delay }}
                    style={{ transformOrigin: '0 0' }}
                  >
                    <motion.div
                      className={`${bubble.size} rounded-full bg-gradient-to-br ${bubble.color} flex items-center justify-center backdrop-blur-sm border border-white/10`}
                      style={{ transform: `translateX(${bubble.orbit}px) translateY(-50%)` }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                    >
                      <span className="font-display text-xs font-bold">{bubble.name}</span>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Connection lines (subtle) */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <circle cx="50%" cy="50%" r="120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="50%" cy="50%" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="50%" cy="50%" r="200" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-sm text-muted-foreground">© 2024 Career Nebula. All rights reserved.</span>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
}

const FeatureCard = ({ icon, title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
  };

  return (
    <motion.div 
      className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
      whileHover={{ y: -5, scale: 1.02 }}
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </motion.div>
  );
};

export default LandingPage;
