import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">CN</span>
            </div>
            <span className="text-lg font-semibold">Career Nebula</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm">Create Your Map</Button>
          </Link>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="mx-6 mt-4">
        <div className="surface-elevated rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm">
            <strong>Demo:</strong> This is a sample career map. Sign up to create your personalized version.
          </span>
          <Link to="/auth?mode=signup">
            <Button size="sm" variant="outline">Get Started</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4 h-[calc(100vh-140px)]">
        <div className="h-full flex gap-4">
          {/* Sidebar */}
          <aside className="w-64 hidden lg:block space-y-4">
            <TimeSlider value={timeProjection} onChange={setTimeProjection} />
            
            <div className="surface-elevated rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">How it works</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>• Larger bubbles = higher fit</li>
                <li>• Distance = effort to reach</li>
                <li>• Hover for quick details</li>
                <li>• Drag "YOU" to explore paths</li>
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
          <TimeSlider value={timeProjection} onChange={setTimeProjection} />
        </div>
      </div>

      {/* Tooltip */}
      {hoveredBubble && (
        <BubbleTooltip bubble={hoveredBubble} mousePosition={mousePosition} />
      )}
    </div>
  );
};

export default ExplorePage;
