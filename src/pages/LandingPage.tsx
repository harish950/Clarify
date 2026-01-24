import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import LandingGraphPreview from '@/components/LandingGraphPreview';
import Header from '@/components/Header';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-graph-bg text-graph-label">
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

        {/* How It Works Section */}
        <section className="py-20 px-6 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">How it works</h2>
              <p className="text-graph-label/70 max-w-lg mx-auto">Three simple steps to discover your ideal career path</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Tell us about you', description: 'Share your skills, interests, and career aspirations through a quick assessment.' },
                { step: '02', title: 'Explore your map', description: 'Navigate an interactive graph of careers tailored to your unique profile.' },
                { step: '03', title: 'Take action', description: 'Follow personalized roadmaps with courses, projects, and milestones.' }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <span className="text-5xl font-bold text-graph-node/20 absolute -top-2 -left-2">{item.step}</span>
                  <div className="pt-8 pl-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-graph-label/70">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Final CTA Section */}
        <section className="py-20 px-6 border-t border-white/10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to find your path?</h2>
            <p className="text-graph-label/70 mb-8 max-w-lg mx-auto">
              Join thousands of fresh graduates who've discovered careers they never knew existed.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 bg-graph-node hover:bg-graph-node/80 text-white">
                Get started for free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-graph-label/60">
          <span>© 2024 Clarity</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
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
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="rounded-xl p-5 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10">
    <div className="w-10 h-10 rounded-lg bg-graph-node/20 text-graph-node flex items-center justify-center mb-3">
      {icon}
    </div>
    <h3 className="font-semibold mb-1 text-white">{title}</h3>
    <p className="text-sm text-graph-label/70">{description}</p>
  </div>
);

export default LandingPage;