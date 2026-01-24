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
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">How it works</h2>
              <p className="text-graph-label/70 max-w-lg mx-auto">Three simple steps to discover your ideal career path</p>
            </motion.div>

            {/* Step 1 */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 items-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="order-2 md:order-1">
                <span className="text-6xl font-bold text-graph-node/20">01</span>
                <h3 className="text-xl font-semibold text-white mb-3 -mt-2">Tell us about you</h3>
                <p className="text-graph-label/70 mb-4">
                  Complete a quick 5-minute assessment that captures your unique combination of skills, interests, and aspirations.
                </p>
                <ul className="space-y-2">
                  {['Technical & soft skills inventory', 'Work style preferences', 'Industry interests & deal-breakers'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-graph-label/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-graph-node" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="space-y-3">
                  {['React', 'TypeScript', 'Problem Solving', 'Communication'].map((skill, i) => (
                    <div key={skill} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${i < 2 ? 'bg-graph-node/20 text-graph-node' : 'bg-white/10 text-white/70'}`}>
                        {i < 2 ? '✓' : '+'}
                      </div>
                      <span className="text-sm text-white/80">{skill}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-graph-node/60 rounded-full" style={{ width: `${90 - i * 15}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 items-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="relative h-48 flex items-center justify-center">
                  {/* Mini graph visualization */}
                  <div className="absolute w-12 h-12 rounded-full border-2 border-graph-node bg-graph-bg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">You</span>
                  </div>
                  {[
                    { name: 'PM', x: -60, y: -40, size: 8 },
                    { name: 'Dev', x: 70, y: -30, size: 10 },
                    { name: 'UX', x: 50, y: 50, size: 7 },
                    { name: 'Data', x: -50, y: 45, size: 6 },
                  ].map((node) => (
                    <div
                      key={node.name}
                      className="absolute bg-graph-node/60 rounded-full flex items-center justify-center"
                      style={{
                        width: node.size * 4,
                        height: node.size * 4,
                        transform: `translate(${node.x}px, ${node.y}px)`,
                      }}
                    >
                      <span className="text-[8px] text-white font-medium">{node.name}</span>
                    </div>
                  ))}
                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line x1="50%" y1="50%" x2="35%" y2="35%" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="70%" y2="38%" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="62%" y2="65%" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
                    <line x1="50%" y1="50%" x2="38%" y2="68%" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-6xl font-bold text-graph-node/20">02</span>
                <h3 className="text-xl font-semibold text-white mb-3 -mt-2">Explore your map</h3>
                <p className="text-graph-label/70 mb-4">
                  Discover an interactive galaxy of career possibilities. Each role is positioned based on how well it fits your profile.
                </p>
                <ul className="space-y-2">
                  {['Drag & zoom to explore possibilities', 'See fit scores for every role', 'Discover paths you never considered'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-graph-label/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-graph-node" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="grid md:grid-cols-2 gap-8 items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="order-2 md:order-1">
                <span className="text-6xl font-bold text-graph-node/20">03</span>
                <h3 className="text-xl font-semibold text-white mb-3 -mt-2">Take action</h3>
                <p className="text-graph-label/70 mb-4">
                  Get a personalized roadmap with concrete steps to close your skill gaps and reach your target role.
                </p>
                <ul className="space-y-2">
                  {['Curated courses & resources', 'Portfolio project ideas', 'Milestone tracking & progress'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-graph-label/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-graph-node" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="order-1 md:order-2 bg-white/5 rounded-2xl p-6 backdrop-blur-sm">
                <div className="space-y-3">
                  {[
                    { title: 'Complete React course', done: true },
                    { title: 'Build portfolio project', done: true },
                    { title: 'Learn TypeScript basics', done: false },
                    { title: 'Practice system design', done: false },
                  ].map((task, i) => (
                    <div key={task.title} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${task.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                        {task.done ? '✓' : (i + 1)}
                      </div>
                      <span className={`text-sm ${task.done ? 'text-white/50 line-through' : 'text-white/80'}`}>{task.title}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-graph-label/60">Progress to Frontend Developer</span>
                    <span className="text-graph-node font-medium">50%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-graph-node rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>
            </motion.div>
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