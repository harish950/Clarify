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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBubble, setSelectedBubble] = useState<CareerBubble | null>(null);
  const [hoveredBubble, setHoveredBubble] = useState<CareerBubble | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time for data/graph preparation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-graph-bg flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated loader */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-graph-node/20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-graph-node/40"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-graph-node/60"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-3 h-3 rounded-full bg-graph-node"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
          
          <motion.p
            className="text-graph-label/80 text-sm font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Mapping your career universe...
          </motion.p>
        </motion.div>
      </div>
    );
  }

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
