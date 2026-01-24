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
      <main className="container mx-auto px-6 pt-6 pb-16">
        {/* Graph as Hero */}
        <motion.div 
          className="max-w-5xl mx-auto" 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-2xl overflow-hidden border border-border/50">
            <div className="h-[420px] md:h-[520px]">
              <LandingGraphPreview />
            </div>
          </div>
          
          {/* CTA Buttons - integrated closer to graph */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8" 
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
        </motion.div>
      </main>

      {/* Features Section - Separate visual area */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto px-6">
          <motion.div 
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto" 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <FeatureCard icon={<Target className="w-5 h-5" />} title="Personalized fit scores" description="See how well each role matches your current skills." />
            <FeatureCard icon={<BarChart3 className="w-5 h-5" />} title="Skill gap analysis" description="Understand what you need to learn next." />
            <FeatureCard icon={<Zap className="w-5 h-5" />} title="Actionable roadmaps" description="Step-by-step guidance to reach your goals." />
          </motion.div>
        </div>
      </section>

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