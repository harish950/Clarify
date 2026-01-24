import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CareerGraph from '@/components/CareerGraph';
import BubbleDetailPanel from '@/components/BubbleDetailPanel';
import BubbleTooltip from '@/components/BubbleTooltip';
import Header from '@/components/Header';
import { CareerBubble } from '@/types/career';
import { mockCareerBubbles, mockUserProfile } from '@/data/mockData';

const Dashboard = () => {
  const [selectedBubble, setSelectedBubble] = useState<CareerBubble | null>(null);
  const [hoveredBubble, setHoveredBubble] = useState<CareerBubble | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
      <Header 
        rightContent={
          <>
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
          </>
        }
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* Graph Area */}
        <main className="flex-1 relative bg-muted/20">
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
              timeMultiplier={1}
              selectedBubbleId={selectedBubble?.id}
            />
          </motion.div>
        </main>

        {/* Detail Panel - Integrated on the right */}
        <AnimatePresence>
          {isPanelOpen && selectedBubble && (
            <motion.aside
              className="w-96 border-l border-border hidden md:block"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 384, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <BubbleDetailPanel 
                bubble={selectedBubble}
                onClose={handleClosePanel}
                isExpanded={isPanelOpen}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredBubble && !isPanelOpen && (
          <BubbleTooltip bubble={hoveredBubble} mousePosition={mousePosition} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
