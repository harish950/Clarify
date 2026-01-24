import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Settings, LogOut, Search, Bell } from 'lucide-react';
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
    <div className="min-h-screen bg-nebula relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-border/50 glass">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-foreground" />
            </div>
            <span className="font-display text-xl font-bold hidden sm:block">Career Nebula</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 glass rounded-lg px-3 py-2 mr-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search careers..." 
              className="bg-transparent border-none outline-none text-sm w-40"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold">
              {mockUserProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="text-sm font-medium hidden sm:block">{mockUserProfile.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside className="w-80 p-4 border-r border-border/50 hidden lg:block overflow-y-auto">
          <div className="space-y-4">
            {/* User Stats */}
            <UserStats 
              level={mockUserProfile.currentLevel}
              xp={mockUserProfile.xp}
              completedQuests={mockUserProfile.completedQuests.length}
              totalQuests={10}
            />

            {/* Time Slider */}
            <TimeSlider 
              value={timeProjection}
              onChange={setTimeProjection}
            />

            {/* Quick Legend */}
            <div className="glass rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">Career Sectors</h3>
              <div className="space-y-2">
                {Array.from(new Set(mockCareerBubbles.map(b => b.sector))).map(sector => {
                  const bubble = mockCareerBubbles.find(b => b.sector === sector);
                  return (
                    <div key={sector} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: bubble?.color }}
                      />
                      <span className="text-sm text-muted-foreground">{sector}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="glass rounded-xl p-4 border-primary/30">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Pro Tip
              </h3>
              <p className="text-xs text-muted-foreground">
                Larger bubbles indicate higher career fit. Drag the "ME" node to simulate different career paths and see how opportunities shift!
              </p>
            </div>
          </div>
        </aside>

        {/* Graph Area */}
        <main className="flex-1 p-4 relative">
          <motion.div 
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
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
          <BubbleTooltip 
            bubble={hoveredBubble} 
            mousePosition={mousePosition}
          />
        )}
      </AnimatePresence>

      {/* Detail Panel */}
      <BubbleDetailPanel 
        bubble={selectedBubble}
        onClose={handleClosePanel}
        isExpanded={isPanelOpen}
      />

      {/* Overlay when panel is open */}
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
