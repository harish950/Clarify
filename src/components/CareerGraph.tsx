import { useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CareerBubble } from '@/types/career';

interface CareerGraphProps {
  bubbles: CareerBubble[];
  onBubbleClick: (bubble: CareerBubble) => void;
  onBubbleHover: (bubble: CareerBubble | null) => void;
  timeMultiplier: number;
}

const CareerGraph = ({ bubbles, onBubbleClick, onBubbleHover, timeMultiplier }: CareerGraphProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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

  const getBubblePosition = (bubble: CareerBubble, index: number) => {
    const angle = (index / bubbles.length) * Math.PI * 2 - Math.PI / 2;
    const adjustedDistance = bubble.distance * (1 - (timeMultiplier - 1) * 0.08);
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35 * (adjustedDistance / 100);
    return {
      x: centerX + userPosition.x + Math.cos(angle) * radius,
      y: centerY + userPosition.y + Math.sin(angle) * radius
    };
  };

  const getBubbleSize = (bubble: CareerBubble) => {
    const baseSize = 48;
    const sizeMultiplier = bubble.fitScore / 100;
    const timeBoost = (timeMultiplier - 1) * 0.15;
    return baseSize + (sizeMultiplier * 36) + (timeBoost * 20);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate offset from the center of the ME node
    const meNodeX = centerX + userPosition.x;
    const meNodeY = centerY + userPosition.y;
    setDragOffset({
      x: e.clientX - rect.left - meNodeX,
      y: e.clientY - rect.top - meNodeY
    });
  }, [centerX, centerY, userPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Calculate new position accounting for the drag offset
    const newX = e.clientX - rect.left - centerX - dragOffset.x;
    const newY = e.clientY - rect.top - centerY - dragOffset.y;
    
    // Limit drag range
    const maxDrag = 120;
    setUserPosition({
      x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
      y: Math.max(-maxDrag, Math.min(maxDrag, newY))
    });
  }, [isDragging, centerX, centerY, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Bubble color mapping - now using unified graph design tokens

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-graph-bg"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Edge blur overlays - exact match with homepage */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-graph-bg via-graph-bg/90 via-60% to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-graph-bg via-graph-bg/60 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-graph-bg to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-graph-bg to-transparent z-[5] pointer-events-none" />

      {/* Connection lines - exact match with homepage */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: 0, top: 0 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {bubbles.map((bubble, index) => {
          if (!bubble.unlocked) return null;
          const pos = getBubblePosition(bubble, index);
          return (
            <motion.line
              key={`line-${bubble.id}`}
              x1={centerX + userPosition.x}
              y1={centerY + userPosition.y}
              x2={pos.x}
              y2={pos.y}
              stroke="hsl(var(--graph-edge))"
              strokeWidth={1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.02 }}
            />
          );
        })}
      </svg>

      {/* Career Bubbles - matching homepage node design */}
      {bubbles.map((bubble, index) => {
        const pos = getBubblePosition(bubble, index);
        const size = getBubbleSize(bubble);
        const isLocked = !bubble.unlocked;

        return (
          <motion.div
            key={bubble.id}
            className={`absolute ${isLocked ? 'opacity-30' : 'cursor-pointer'}`}
            style={{
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              width: size,
              height: size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.03, ease: "easeOut" }}
            whileHover={!isLocked ? { scale: 1.12, zIndex: 10 } : undefined}
            whileTap={!isLocked ? { scale: 0.98 } : undefined}
            onClick={() => !isLocked && onBubbleClick(bubble)}
            onMouseEnter={() => !isLocked && onBubbleHover(bubble)}
            onMouseLeave={() => onBubbleHover(null)}
          >
            {/* Node circle - matching homepage style */}
            <div className="w-full h-full rounded-full bg-graph-node" />
            
            {/* Label positioned outside the circle */}
            <span 
              className="absolute left-full ml-2 whitespace-nowrap text-graph-label font-medium text-xs top-1/2 -translate-y-1/2"
            >
              {bubble.name.split(' ')[0]}
            </span>

            {isLocked && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-graph-bg/60 backdrop-blur-sm">
                <span className="text-sm">🔒</span>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Center "You" Node - matching homepage main node design */}
      <motion.div
        className={`absolute z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: centerX + userPosition.x - 28,
          top: centerY + userPosition.y - 28,
          width: 56,
          height: 56,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onMouseDown={handleMouseDown}
      >
        {/* Node circle - matching homepage main node */}
        <div className="w-full h-full rounded-full bg-graph-node-main" />
        
        {/* Label positioned outside the circle */}
        <span className="absolute left-full ml-3 whitespace-nowrap text-graph-label font-bold text-sm top-1/2 -translate-y-1/2">
          You
        </span>
      </motion.div>

      {/* Drag hint */}
      {!isDragging && userPosition.x === 0 && userPosition.y === 0 && (
        <motion.div 
          className="absolute left-1/2 bottom-6 -translate-x-1/2 text-xs text-graph-label/70 bg-graph-bg/80 backdrop-blur-sm px-4 py-2 rounded-full border border-graph-edge/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Drag "You" to explore different paths
        </motion.div>
      )}
    </div>
  );
};

export default CareerGraph;
