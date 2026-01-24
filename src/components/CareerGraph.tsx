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

  // Bubble color mapping
  const getBubbleColor = (sector: string) => {
    const colors: Record<string, string> = {
      'Technology': 'hsl(220, 90%, 56%)',
      'Data & AI': 'hsl(262, 80%, 55%)',
      'Business': 'hsl(340, 75%, 55%)',
      'Design': 'hsl(175, 75%, 45%)',
    };
    return colors[sector] || 'hsl(220, 90%, 56%)';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-muted/30 rounded-2xl border border-border"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid pattern background */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
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
              stroke="hsl(var(--border))"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
            />
          );
        })}
        
        {/* Distance rings */}
        {[0.3, 0.55, 0.8].map((radius, i) => (
          <circle
            key={i}
            cx={centerX + userPosition.x}
            cy={centerY + userPosition.y}
            r={Math.min(dimensions.width, dimensions.height) * 0.35 * radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
      </svg>

      {/* Career Bubbles */}
      {bubbles.map((bubble, index) => {
        const pos = getBubblePosition(bubble, index);
        const size = getBubbleSize(bubble);
        const isLocked = !bubble.unlocked;
        const bubbleColor = getBubbleColor(bubble.sector);

        return (
          <motion.div
            key={bubble.id}
            className={`absolute cursor-pointer ${isLocked ? 'opacity-30' : ''}`}
            style={{
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              width: size,
              height: size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            whileHover={{ scale: 1.12, zIndex: 10 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !isLocked && onBubbleClick(bubble)}
            onMouseEnter={() => !isLocked && onBubbleHover(bubble)}
            onMouseLeave={() => onBubbleHover(null)}
          >
            <div 
              className="w-full h-full rounded-full flex items-center justify-center relative shadow-lg border-2 border-background transition-shadow hover:shadow-xl"
              style={{ backgroundColor: bubbleColor }}
            >
              <div className="text-center px-1">
                <span className="font-semibold text-white text-xs leading-tight block drop-shadow-sm">
                  {bubble.name.split(' ')[0]}
                </span>
                {size > 60 && (
                  <span className="text-white/90 text-[10px] font-medium">
                    {bubble.fitScore}%
                  </span>
                )}
              </div>

              {isLocked && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-background/60 backdrop-blur-sm">
                  <span className="text-sm">🔒</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Center "Me" Node */}
      <motion.div
        className={`absolute z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: centerX + userPosition.x - 44,
          top: centerY + userPosition.y - 44,
          width: 88,
          height: 88,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full rounded-full bg-foreground flex items-center justify-center shadow-xl border-4 border-background">
          <span className="font-bold text-lg text-background tracking-tight">YOU</span>
        </div>
      </motion.div>

      {/* Drag hint */}
      {!isDragging && userPosition.x === 0 && userPosition.y === 0 && (
        <motion.div 
          className="absolute left-1/2 bottom-6 -translate-x-1/2 text-xs text-muted-foreground bg-card px-4 py-2 rounded-full border border-border shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Drag "YOU" to explore different paths
        </motion.div>
      )}
    </div>
  );
};

export default CareerGraph;
