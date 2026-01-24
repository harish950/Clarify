import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingGraphPreview from '@/components/LandingGraphPreview';

const LandingPage = () => {
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 border-b border-border">
        <motion.div className="flex items-center gap-2" initial={{
        opacity: 0,
        x: -20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.4
      }}>
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CN</span>
          </div>
          <span className="text-lg font-semibold">Career Nebula</span>
        </motion.div>

        <motion.div className="flex items-center gap-3" initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.4,
        delay: 0.1
      }}>
          <Link to="/auth">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-8 pb-20">
        {/* Graph as Hero */}
        <motion.div 
          className="max-w-6xl mx-auto mb-12" 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
            <div className="h-[500px] md:h-[600px]">
              <LandingGraphPreview />
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/auth?mode=signup">
            <Button size="lg" className="gap-2">
              Start mapping your career
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/explore">
            <Button variant="outline" size="lg">
              Try the demo
            </Button>
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-4 mt-20 max-w-4xl mx-auto" 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <FeatureCard icon={<Target className="w-5 h-5" />} title="Personalized fit scores" description="See how well each role matches your current skills and interests." />
          <FeatureCard icon={<BarChart3 className="w-5 h-5" />} title="Skill gap analysis" description="Understand exactly what you need to learn to reach your goals." />
          <FeatureCard icon={<Zap className="w-5 h-5" />} title="Actionable roadmaps" description="Get step-by-step guidance with courses, projects, and milestones." />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2024 Career Nebula</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>;
};
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
const FeatureCard = ({
  icon,
  title,
  description
}: FeatureCardProps) => <div className="surface-elevated rounded-xl p-5 hover:border-primary/30 transition-colors">
    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-semibold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>;
export default LandingPage;