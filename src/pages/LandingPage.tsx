import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Target, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      <main className="container mx-auto px-6 pt-24 pb-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }}>
            
          </motion.div>

          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.1
        }}>
            Navigate your career with{' '}
            <span className="text-gradient">clarity</span>
          </motion.h1>

          <motion.p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            Visualize career opportunities as an interactive map. See which roles fit your skills, what you need to learn, and how to get there.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }}>
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
        </div>

        {/* Feature Cards */}
        <motion.div className="grid md:grid-cols-3 gap-4 mt-24 max-w-4xl mx-auto" initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6,
        delay: 0.5
      }}>
          <FeatureCard icon={<Target className="w-5 h-5" />} title="Personalized fit scores" description="See how well each role matches your current skills and interests." />
          <FeatureCard icon={<BarChart3 className="w-5 h-5" />} title="Skill gap analysis" description="Understand exactly what you need to learn to reach your goals." />
          <FeatureCard icon={<Zap className="w-5 h-5" />} title="Actionable roadmaps" description="Get step-by-step guidance with courses, projects, and milestones." />
        </motion.div>

        {/* Preview */}
        <motion.div className="mt-24 max-w-4xl mx-auto" initial={{
        opacity: 0,
        scale: 0.98
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.6,
        delay: 0.7
      }}>
          <div className="surface-elevated rounded-2xl p-6 relative overflow-hidden">
            <div className="aspect-[16/10] bg-muted/50 rounded-xl flex items-center justify-center relative">
              {/* Mini visualization */}
              <div className="relative">
                {/* Center node */}
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center z-10 relative shadow-lg">
                  <span className="font-bold text-background text-sm">YOU</span>
                </div>

                {/* Orbiting bubbles */}
                {[{
                name: 'SWE',
                color: 'bg-primary',
                x: -100,
                y: -60
              }, {
                name: 'PM',
                color: 'bg-accent',
                x: 100,
                y: -40
              }, {
                name: 'DS',
                color: 'bg-bubble-data',
                x: -80,
                y: 80
              }, {
                name: 'UX',
                color: 'bg-bubble-design',
                x: 110,
                y: 60
              }].map((bubble, i) => <motion.div key={bubble.name} className={`absolute w-12 h-12 rounded-full ${bubble.color} flex items-center justify-center shadow-md`} style={{
                left: `calc(50% + ${bubble.x}px - 24px)`,
                top: `calc(50% + ${bubble.y}px - 24px)`
              }} initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} transition={{
                delay: 1 + i * 0.1
              }}>
                    <span className="text-white text-xs font-semibold">{bubble.name}</span>
                  </motion.div>)}

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{
                left: -120,
                top: -100,
                width: 300,
                height: 240
              }}>
                  {[{
                  x: 50,
                  y: 60
                }, {
                  x: 250,
                  y: 80
                }, {
                  x: 70,
                  y: 200
                }, {
                  x: 260,
                  y: 180
                }].map((pos, i) => <line key={i} x1="150" y1="120" x2={pos.x} y2={pos.y} stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="4 4" />)}
                </svg>
              </div>
            </div>
          </div>
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