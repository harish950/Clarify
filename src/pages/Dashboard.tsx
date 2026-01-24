import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Search, Bell, Filter, RefreshCw, PanelLeftClose, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CareerGraph from '@/components/CareerGraph';
import BubbleDetailPanel from '@/components/BubbleDetailPanel';
import BubbleTooltip from '@/components/BubbleTooltip';
import Header from '@/components/Header';
import UserProfileDrawer from '@/components/UserProfileDrawer';
import RoadmapDrawer from '@/components/RoadmapDrawer';
import { MatchFiltersPanel } from '@/components/MatchFiltersPanel';
import { CareerBubble } from '@/types/career';
import { SavedPath } from '@/types/roadmap';
import { mockCareerBubbles, mockUserProfile } from '@/data/mockData';
import { useJobMatching } from '@/hooks/useJobMatching';
import { useSavedPaths } from '@/hooks/useSavedPaths';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { RoadmapStep } from '@/types/roadmap';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBubble, setSelectedBubble] = useState<CareerBubble | null>(null);
  const [hoveredBubble, setHoveredBubble] = useState<CareerBubble | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserDrawer, setShowUserDrawer] = useState(true);
  const [selectedPath, setSelectedPath] = useState<SavedPath | null>(null);
  const [showRoadmapDrawer, setShowRoadmapDrawer] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const { savedPaths, loadSavedPaths, updateStepCompletion } = useSavedPaths();

  const {
    matches,
    allMatches,
    filters,
    filterOptions,
    isRefreshing,
    loadMatches,
    refreshMatches,
    updateFilters,
    resetFilters,
  } = useJobMatching();

  // Check auth and load matches
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await loadMatches();
        await loadSavedPaths();
        
        // Load user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        setUserProfile(profile);
      }
      setIsLoading(false);
    };
    
    // Small delay for loading animation
    const timer = setTimeout(checkAuth, 1000);
    return () => clearTimeout(timer);
  }, [loadMatches, loadSavedPaths]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Convert job matches to career bubbles for display
  const enhancedBubbles = useMemo(() => {
    if (matches.length === 0) return mockCareerBubbles;

    // Create a map of match data by job title for quick lookup
    const matchMap = new Map(matches.map(m => [m.job.title.toLowerCase(), m]));
    
    return mockCareerBubbles.map(bubble => {
      const match = matchMap.get(bubble.name.toLowerCase());
      if (match) {
        return {
          ...bubble,
          fitScore: Math.round(match.weightedScore * 100),
          matchedSkills: match.matchedSkills.length > 0 ? match.matchedSkills : bubble.matchedSkills,
          missingSkills: match.missingSkills.length > 0 ? match.missingSkills : bubble.missingSkills,
        };
      }
      return bubble;
    });
  }, [matches]);

  // Get match data for selected bubble
  const selectedMatchData = useMemo(() => {
    if (!selectedBubble) return null;
    return matches.find(m => m.job.title.toLowerCase() === selectedBubble.name.toLowerCase()) || null;
  }, [selectedBubble, matches]);

  const handleBubbleClick = (bubble: CareerBubble) => {
    setSelectedBubble(bubble);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedBubble(null), 300);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out', description: 'See you next time!' });
    navigate('/');
  };

  const handlePathClick = (path: SavedPath) => {
    setSelectedPath(path);
    setShowRoadmapDrawer(true);
  };

  const handleRoadmapStepComplete = async (stepId: string, completed: boolean) => {
    if (!selectedPath) return;
    await updateStepCompletion(selectedPath.id, stepId, completed);
    
    // Update local selected path state
    setSelectedPath(prev => {
      if (!prev) return null;
      const updatedRoadmap = prev.roadmap.map(step =>
        step.id === stepId ? { ...step, completed } : step
      );
      const completedCount = updatedRoadmap.filter(s => s.completed).length;
      const progressPercentage = Math.round((completedCount / updatedRoadmap.length) * 100);
      return {
        ...prev,
        roadmap: updatedRoadmap,
        progress_percentage: progressPercentage,
        status: progressPercentage === 100 ? 'completed' : 'active'
      };
    });
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
            <Button 
              variant={showFilters ? "default" : "ghost"} 
              size="icon" 
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="w-4 h-4" />
              {(filters.minScore > 0 || filters.jobType.length > 0 || filters.location.length > 0) && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={refreshMatches}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {allMatches.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="w-px h-5 bg-border mx-1" />
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-xs font-semibold text-background cursor-pointer"
                onClick={handleLogout}
                title="Sign out"
              >
                {user?.user_metadata?.name 
                  ? user.user_metadata.name.split(' ').map((n: string) => n[0]).join('')
                  : mockUserProfile.name.split(' ').map(n => n[0]).join('')
                }
              </div>
            </div>
          </>
        }
      />

      {/* Main Content */}
      <div className="flex h-[calc(100vh-57px)]">
        {/* User Profile Drawer - Left Side */}
        <AnimatePresence>
          {showUserDrawer && (
            <motion.aside
              className="w-72 border-r border-border hidden md:block"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <UserProfileDrawer 
                user={user}
                savedPaths={savedPaths}
                userProfile={userProfile}
                onPathClick={handlePathClick}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              className="w-72 border-r border-border p-4 overflow-y-auto"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <MatchFiltersPanel
                filters={filters}
                filterOptions={filterOptions}
                onUpdateFilters={updateFilters}
                onResetFilters={resetFilters}
                onRefresh={refreshMatches}
                isRefreshing={isRefreshing}
                matchCount={matches.length}
                totalCount={allMatches.length}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Graph Area */}
        <main className="flex-1 relative bg-muted/20">
          {/* Toggle User Drawer Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 surface-elevated"
            onClick={() => setShowUserDrawer(!showUserDrawer)}
            title={showUserDrawer ? 'Hide profile' : 'Show profile'}
          >
            {showUserDrawer ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </Button>

          <motion.div 
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CareerGraph 
              bubbles={enhancedBubbles}
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
                matchData={selectedMatchData}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Roadmap Drawer for viewing saved paths */}
      <RoadmapDrawer
        open={showRoadmapDrawer}
        onOpenChange={setShowRoadmapDrawer}
        careerName={selectedPath?.career_name || ''}
        roadmap={selectedPath?.roadmap || []}
        onStepComplete={handleRoadmapStepComplete}
      />

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
