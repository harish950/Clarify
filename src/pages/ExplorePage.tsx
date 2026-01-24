import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CareerGraph from '@/components/CareerGraph';
import BubbleTooltip from '@/components/BubbleTooltip';
import TimeSlider from '@/components/TimeSlider';
import { CareerBubble } from '@/types/career';
import { mockCareerBubbles } from '@/data/mockData';

const ExplorePage = () => {
  const [hoveredBubble, setHoveredBubble] = useState<CareerBubble | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeProjection, setTimeProjection] = useState(1);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-nebula relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Career Nebula</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button variant="glow" size="sm">
              Create Your Universe
            </Button>
          </Link>
        </div>
      </header>

      {/* Demo Banner */}
      <motion.div 
        className="relative z-10 mx-6 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm">
              <strong>Demo Mode:</strong> This is a sample career universe. Sign up to create your personalized map!
            </span>
          </div>
          <Link to="/auth?mode=signup">
            <Button variant="default" size="sm">Get Started</Button>
          </Link>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 px-6 h-[calc(100vh-160px)]">
        <div className="h-full flex gap-4">
          {/* Sidebar */}
          <aside className="w-72 hidden lg:block">
            <TimeSlider 
              value={timeProjection}
              onChange={setTimeProjection}
            />
            
            <div className="glass rounded-xl p-4 mt-4">
              <h3 className="text-sm font-semibold mb-3">How it works</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Bubble size = career fit based on your profile
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Distance from center = effort to reach
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Hover to see details, click for roadmap
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Drag "ME" to simulate career paths
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Use time slider to project future
                </li>
              </ul>
            </div>
          </aside>

          {/* Graph */}
          <main className="flex-1">
            <CareerGraph 
              bubbles={mockCareerBubbles}
              onBubbleClick={() => {}}
              onBubbleHover={setHoveredBubble}
              timeMultiplier={timeProjection}
            />
          </main>
        </div>

        {/* Mobile Time Slider */}
        <div className="absolute bottom-4 left-6 right-6 lg:hidden">
          <TimeSlider 
            value={timeProjection}
            onChange={setTimeProjection}
          />
        </div>
      </div>

      {/* Tooltip */}
      {hoveredBubble && (
        <BubbleTooltip 
          bubble={hoveredBubble} 
          mousePosition={mousePosition}
        />
      )}
    </div>
  );
};

export default ExplorePage;
