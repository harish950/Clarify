import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Search, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CareerGraph from '@/components/CareerGraph';
import BubbleDetailPanel from '@/components/BubbleDetailPanel';
import BubbleTooltip from '@/components/BubbleTooltip';
import TimeSlider from '@/components/TimeSlider';
import UserStats from '@/components/UserStats';
import { CareerBubble } from '@/types/career';
import { mockCareerBubbles, mockUserProfile } from '@/data/mockData';

const Dashboard = () => {
  const [selectedBubble, setSelectedBubble] = useState<CareerBubble | null>(null);
  const [hoveredBubble, setHoveredBubble] = useState<CareerBubble | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeProjection, setTimeProjection] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleBubbleClick = (bubble: CareerBubble) => {
    setSelectedBubble(bubble);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedBubble(null), 300);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">CN</span>
            </div>
            <span className="font-semibold hidden sm:block">Career Nebula</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5 mr-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search careers..." 
              className="bg-transparent border-none outline-none text-sm w-32"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-xs font-semibold text-background">
              {mockUserProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <aside className="w-72 p-4 border-r border-border hidden lg:block overflow-y-auto bg-card">
          <div className="space-y-4">
            <UserStats 
              level={mockUserProfile.currentLevel}
              xp={mockUserProfile.xp}
              completedQuests={mockUserProfile.completedQuests.length}
              totalQuests={10}
            />

            <TimeSlider 
              value={timeProjection}
              onChange={setTimeProjection}
            />

            <div className="surface-elevated rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Sectors</h3>
              <div className="space-y-2">
                {Array.from(new Set(mockCareerBubbles.map(b => b.sector))).map(sector => {
                  const colors: Record<string, string> = {
                    'Technology': 'bg-primary',
                    'Data & AI': 'bg-accent',
                    'Business': 'bg-bubble-business',
                    'Design': 'bg-bubble-design',
                  };
                  return (
                    <div key={sector} className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors[sector] || 'bg-primary'}`} />
                      <span className="text-sm text-muted-foreground">{sector}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Graph Area */}
        <main className="flex-1 p-4 relative bg-muted/20">
          <motion.div 
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CareerGraph 
              bubbles={mockCareerBubbles}
              onBubbleClick={handleBubbleClick}
              onBubbleHover={setHoveredBubble}
              timeMultiplier={timeProjection}
            />
          </motion.div>

          {/* Mobile Time Slider */}
          <div className="absolute bottom-4 left-4 right-4 lg:hidden">
            <TimeSlider 
              value={timeProjection}
              onChange={setTimeProjection}
            />
          </div>
        </main>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredBubble && !isPanelOpen && (
          <BubbleTooltip bubble={hoveredBubble} mousePosition={mousePosition} />
        )}
      </AnimatePresence>

      {/* Detail Panel */}
      <BubbleDetailPanel 
        bubble={selectedBubble}
        onClose={handleClosePanel}
        isExpanded={isPanelOpen}
      />

      {/* Overlay */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            className="fixed inset-0 bg-background/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
