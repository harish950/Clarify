import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingGraphPreview from '@/components/LandingGraphPreview';
import Header from '@/components/Header';

const LandingPage = () => {
  return <div className="min-h-screen bg-graph-bg text-graph-label">
      {/* Navigation */}
      <Header 
        variant="transparent" 
        rightContent={
          <>
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-graph-label hover:text-white hover:bg-white/10">Sign In</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button size="sm" className="bg-graph-node hover:bg-graph-node/80">Get Started</Button>
            </Link>
          </>
        }
      />

      {/* Hero Section */}
      <main>
        {/* Graph as Hero - full width */}
        <motion.div 
          className="w-full" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="h-[500px] md:h-[600px]">
            <LandingGraphPreview />
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
            <Button size="lg" className="gap-2 bg-graph-node hover:bg-graph-node/80 text-white">
              Start mapping your career
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto px-6 pb-20" 
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
      <footer className="py-6 px-6">
        <div className="container mx-auto flex items-center justify-between text-sm text-graph-label/60">
          <span>© 2024 Clarity</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
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
}: FeatureCardProps) => <div className="rounded-xl p-5 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10">
    <div className="w-10 h-10 rounded-lg bg-graph-node/20 text-graph-node flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-semibold mb-1 text-white">{title}</h3>
    <p className="text-sm text-graph-label/70">{description}</p>
  </div>;
export default LandingPage;