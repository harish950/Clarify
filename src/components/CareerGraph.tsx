import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CareerBubble } from '@/types/career';
import { mockSkills, mockUserProfile } from '@/data/mockData';

interface CareerGraphProps {
  bubbles: CareerBubble[];
  onBubbleClick: (bubble: CareerBubble) => void;
  onBubbleHover: (bubble: CareerBubble | null) => void;
  timeMultiplier: number;
  selectedBubbleId?: string | null;
  onViewChange?: (offset: { x: number; y: number }) => void;
}

interface JobNode {
  job: CareerBubble;
  x: number;
  y: number;
  size: number;
  labelSide: 'left' | 'right';
}

interface SkillNode {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  connectedJobs: string[];
  labelSide: 'left' | 'right';
  isAcquired: boolean;
}

const CareerGraph = ({ bubbles, onBubbleClick, onBubbleHover, timeMultiplier, selectedBubbleId, onViewChange }: CareerGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [targetOffset, setTargetOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Animate viewOffset towards targetOffset
  useEffect(() => {
    if (viewOffset.x === targetOffset.x && viewOffset.y === targetOffset.y) return;
    
    const animationFrame = requestAnimationFrame(() => {
      const ease = 0.12;
      const newX = viewOffset.x + (targetOffset.x - viewOffset.x) * ease;
      const newY = viewOffset.y + (targetOffset.y - viewOffset.y) * ease;
      
      // Stop when close enough
      if (Math.abs(targetOffset.x - newX) < 0.5 && Math.abs(targetOffset.y - newY) < 0.5) {
        setViewOffset(targetOffset);
      } else {
        setViewOffset({ x: newX, y: newY });
      }
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [viewOffset, targetOffset]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // Handle zoom with mouse wheel
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.003;
    const newZoom = Math.max(0.4, Math.min(2.5, zoom - e.deltaY * zoomSpeed));
    setZoom(newZoom);
  }, [zoom]);

  const resetView = useCallback(() => {
    setTargetOffset({ x: 0, y: 0 });
    setZoom(1);
    onViewChange?.({ x: 0, y: 0 });
  }, [onViewChange]);

  // Center view on a specific job node with smooth animation
  const centerOnJob = useCallback((jobX: number, jobY: number) => {
    const offsetX = centerX - jobX;
    const offsetY = centerY - jobY;
    setTargetOffset({ x: offsetX, y: offsetY });
  }, [centerX, centerY]);

  // Position jobs around the center and skills around jobs
  const { jobNodes, skillNodes } = useMemo(() => {
    const jobRadius = Math.min(dimensions.width, dimensions.height) * 0.28;
    const skillRadius = 90;
    
    // Position jobs evenly around center
    const jobs: JobNode[] = bubbles.map((job, index) => {
      const angle = (index / bubbles.length) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + viewOffset.x + Math.cos(angle) * jobRadius;
      const y = centerY + viewOffset.y + Math.sin(angle) * jobRadius;
      
      return {
        job,
        x,
        y,
        size: 80 + (job.fitScore / 100) * 30, // Bigger bubbles: 80-110px
        labelSide: x > centerX + viewOffset.x ? 'right' : 'left'
      };
    });

    // Get skills that connect to visible jobs
    const visibleJobIds = bubbles.map(b => b.id);
    const relevantSkills = mockSkills.filter(skill => 
      skill.jobs.some(jobId => visibleJobIds.includes(jobId))
    );

    // Position skills - place them between jobs they connect to
    const skills: SkillNode[] = relevantSkills.map((skill, index) => {
      // Find jobs this skill connects to
      const connectedJobNodes = jobs.filter(j => skill.jobs.includes(j.job.id));
      
      if (connectedJobNodes.length === 0) {
        return null;
      }

      // Calculate position as weighted center of connected jobs, pushed outward
      let avgX = connectedJobNodes.reduce((sum, j) => sum + j.x, 0) / connectedJobNodes.length;
      let avgY = connectedJobNodes.reduce((sum, j) => sum + j.y, 0) / connectedJobNodes.length;
      
      // Push skill outward from center
      const angleFromCenter = Math.atan2(avgY - centerY - viewOffset.y, avgX - centerX - viewOffset.x);
      const distanceFromCenter = Math.sqrt(
        Math.pow(avgX - centerX - viewOffset.x, 2) + 
        Math.pow(avgY - centerY - viewOffset.y, 2)
      );
      
      // Position skill further out than jobs, with some spread
      const skillDistance = distanceFromCenter + skillRadius + (index % 3) * 25;
      const angleOffset = ((index % 5) - 2) * 0.15;
      
      const x = centerX + viewOffset.x + Math.cos(angleFromCenter + angleOffset) * skillDistance;
      const y = centerY + viewOffset.y + Math.sin(angleFromCenter + angleOffset) * skillDistance;

      // Check if user has this skill
      const userSkillNames = mockUserProfile.skills.map(s => s.toLowerCase());
      const isAcquired = userSkillNames.includes(skill.name.toLowerCase());

      return {
        id: skill.id,
        name: skill.name,
        x,
        y,
        size: 16 + connectedJobNodes.length * 2,
        connectedJobs: skill.jobs.filter(jobId => visibleJobIds.includes(jobId)),
        labelSide: x > centerX + viewOffset.x ? 'right' : 'left',
        isAcquired
      };
    }).filter(Boolean) as SkillNode[];

    return { jobNodes: jobs, skillNodes: skills };
  }, [bubbles, dimensions, centerX, centerY, viewOffset]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - viewOffset.x,
      y: e.clientY - viewOffset.y
    });
  }, [viewOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const maxDrag = 200;
    const newOffset = {
      x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
      y: Math.max(-maxDrag, Math.min(maxDrag, newY))
    };
    setViewOffset(newOffset);
    setTargetOffset(newOffset);
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const isDefaultView = viewOffset.x === 0 && viewOffset.y === 0 && zoom === 1;

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-graph-bg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Zoomable content wrapper */}
      <div 
        className="absolute inset-0 transition-transform duration-100"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Lines from You to Jobs */}
        {jobNodes.map((jobNode, index) => (
          <motion.line
            key={`line-you-${jobNode.job.id}`}
            x1={centerX + viewOffset.x}
            y1={centerY + viewOffset.y}
            x2={jobNode.x}
            y2={jobNode.y}
            stroke="hsl(var(--graph-edge))"
            strokeWidth={2.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: jobNode.job.unlocked ? 0.7 : 0.25 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.05 }}
          />
        ))}
        
        {/* Lines from Jobs to Skills */}
        {skillNodes.map((skillNode) =>
          skillNode.connectedJobs.map((jobId) => {
            const jobNode = jobNodes.find(j => j.job.id === jobId);
            if (!jobNode) return null;
            
            return (
              <motion.line
                key={`line-${jobId}-${skillNode.id}`}
                x1={jobNode.x}
                y1={jobNode.y}
                x2={skillNode.x}
                y2={skillNode.y}
                stroke="hsl(var(--graph-edge))"
                strokeWidth={1}
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
            );
          })
        )}
      </svg>

      {/* Job Nodes */}
      {jobNodes.map((jobNode, index) => {
        const isLocked = !jobNode.job.unlocked;
        const isSelected = selectedBubbleId === jobNode.job.id;
        
        return (
          <motion.div
            key={jobNode.job.id}
            className={`absolute ${isLocked ? 'opacity-30' : 'cursor-pointer'}`}
            style={{
              left: jobNode.x - jobNode.size / 2,
              top: jobNode.y - jobNode.size / 2,
              width: jobNode.size,
              height: jobNode.size,
              zIndex: isSelected ? 20 : 10,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isSelected ? 1.15 : 1, 
              opacity: isLocked ? 0.3 : 1 
            }}
            transition={{ duration: 0.4, delay: 0.25 + index * 0.05, ease: "easeOut" }}
            whileHover={!isLocked && !isSelected ? { scale: 1.08, zIndex: 15 } : undefined}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLocked) {
                // Calculate the base position (without current offset) to center on
                const jobRadius = Math.min(dimensions.width, dimensions.height) * 0.28;
                const angle = (index / bubbles.length) * Math.PI * 2 - Math.PI / 2;
                const baseX = centerX + Math.cos(angle) * jobRadius;
                const baseY = centerY + Math.sin(angle) * jobRadius;
                centerOnJob(baseX, baseY);
                onBubbleClick(jobNode.job);
              }
            }}
            onMouseEnter={() => !isLocked && onBubbleHover(jobNode.job)}
            onMouseLeave={() => onBubbleHover(null)}
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center p-2 transition-all duration-300 ${
              isSelected 
                ? 'bg-primary ring-4 ring-primary/30 shadow-lg shadow-primary/25' 
                : 'bg-graph-node-main/90 hover:bg-graph-node-main'
            }`}>
              <span 
                className={`text-center font-semibold leading-tight transition-all duration-300 ${
                  isSelected 
                    ? 'text-primary-foreground text-xs' 
                    : 'text-graph-bg text-[10px]'
                }`}
                style={{
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {jobNode.job.name}
              </span>
            </div>
            {isLocked && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-graph-bg/50">
                <span className="text-sm">🔒</span>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Skill Nodes */}
      {skillNodes.map((skillNode, index) => (
        <motion.div
          key={skillNode.id}
          className="absolute"
          style={{
            left: skillNode.x - skillNode.size / 2,
            top: skillNode.y - skillNode.size / 2,
            width: skillNode.size,
            height: skillNode.size,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 + index * 0.02, ease: "easeOut" }}
          whileHover={{ scale: 1.2, zIndex: 15 }}
        >
          <div className={`w-full h-full rounded-full ${
            skillNode.isAcquired 
              ? 'bg-emerald-500/20 border border-emerald-500/40' 
              : 'bg-bubble-warning/20 border border-bubble-warning/40'
          }`} />
          <span 
            className={`absolute whitespace-nowrap text-graph-label font-medium text-[8px] top-1/2 -translate-y-1/2 opacity-70 ${
              skillNode.labelSide === 'right' ? 'left-full ml-1' : 'right-full mr-1 text-right'
            }`}
          >
            {skillNode.name}
          </span>
        </motion.div>
      ))}

      {/* Center "You" Node */}
      <motion.div
        className="absolute z-20"
        style={{
          left: centerX + viewOffset.x - 32,
          top: centerY + viewOffset.y - 32,
          width: 64,
          height: 64,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-full h-full rounded-full border-[3px] border-graph-node-main bg-graph-bg flex items-center justify-center">
          <span className="text-graph-label font-bold text-sm">You</span>
        </div>
      </motion.div>
      </div>

      {/* Edge blur overlays - outside zoom wrapper */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-graph-bg via-graph-bg/80 via-50% to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-graph-bg via-graph-bg/60 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-graph-bg to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-graph-bg to-transparent z-[5] pointer-events-none" />

      {/* Drag hint */}
      {!isDragging && isDefaultView && (
        <motion.div 
          className="absolute left-1/2 bottom-6 -translate-x-1/2 text-xs text-graph-label/70 bg-graph-bg/80 backdrop-blur-sm px-4 py-2 rounded-full border border-graph-edge/30 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Scroll to zoom · Drag to explore
        </motion.div>
      )}

      {/* Reset view button */}
      {!isDefaultView && (
        <motion.div
          className="absolute bottom-4 right-4 z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={resetView}
            className="gap-1.5 shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CareerGraph;
