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

  // Calculate bubble positions based on distance (effort)
  const getBubblePosition = (bubble: CareerBubble, index: number) => {
    const angle = (index / bubbles.length) * Math.PI * 2 - Math.PI / 2;
    const adjustedDistance = bubble.distance * (1 - (timeMultiplier - 1) * 0.1);
    const radius = Math.min(dimensions.width, dimensions.height) * 0.35 * (adjustedDistance / 100);
    return {
      x: centerX + userPosition.x + Math.cos(angle) * radius,
      y: centerY + userPosition.y + Math.sin(angle) * radius
    };
  };

  // Calculate bubble size based on fit score and time
  const getBubbleSize = (bubble: CareerBubble) => {
    const baseSize = 40;
    const sizeMultiplier = bubble.fitScore / 100;
    const timeBoost = timeMultiplier * 0.1;
    return baseSize + (sizeMultiplier * 40) + (timeBoost * 10);
  };

  const handleDrag = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const newX = e.clientX - rect.left - centerX;
    const newY = e.clientY - rect.top - centerY;
    
    // Limit drag range
    const maxDrag = 100;
    setUserPosition({
      x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
      y: Math.max(-maxDrag, Math.min(maxDrag, newY))
    });
  }, [isDragging, centerX, centerY]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-background/50 rounded-2xl"
      onMouseMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
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
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          );
        })}
        
        {/* Orbital rings */}
        {[0.3, 0.5, 0.7].map((radius, i) => (
          <circle
            key={i}
            cx={centerX + userPosition.x}
            cy={centerY + userPosition.y}
            r={Math.min(dimensions.width, dimensions.height) * 0.35 * radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.3"
          />
        ))}
      </svg>

      {/* Career Bubbles */}
      {bubbles.map((bubble, index) => {
        const pos = getBubblePosition(bubble, index);
        const size = getBubbleSize(bubble);
        const isLocked = !bubble.unlocked;

        return (
          <motion.div
            key={bubble.id}
            className={`absolute cursor-pointer transition-all duration-300 ${
              isLocked ? 'opacity-40 blur-sm' : ''
            }`}
            style={{
              left: pos.x - size / 2,
              top: pos.y - size / 2,
              width: size,
              height: size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: [0, Math.random() * 4 - 2, 0],
              y: [0, Math.random() * 4 - 2, 0],
            }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              x: { duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.15, zIndex: 10 }}
            onClick={() => !isLocked && onBubbleClick(bubble)}
            onMouseEnter={() => !isLocked && onBubbleHover(bubble)}
            onMouseLeave={() => onBubbleHover(null)}
          >
            <div 
              className="w-full h-full rounded-full flex items-center justify-center relative"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${bubble.color}, ${bubble.color.replace('60%', '40%')})`,
                boxShadow: isLocked ? 'none' : `0 0 ${size/2}px ${bubble.color.replace(')', ' / 0.4)')}`,
              }}
            >
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse-glow"
                style={{
                  background: `radial-gradient(circle, ${bubble.color.replace(')', ' / 0.3)')}, transparent 70%)`,
                }}
              />
              
              {/* Content */}
              <div className="relative z-10 text-center px-1">
                <span className="font-display font-bold text-foreground text-xs leading-tight block">
                  {bubble.name.split(' ').slice(0, 2).join(' ')}
                </span>
                {size > 60 && (
                  <span className="text-foreground/80 text-[10px]">
                    {bubble.fitScore}%
                  </span>
                )}
              </div>

              {/* Lock overlay */}
              {isLocked && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-background/50">
                  <span className="text-lg">🔒</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Center "Me" Node */}
      <motion.div
        className="absolute cursor-grab active:cursor-grabbing z-20"
        style={{
          left: centerX + userPosition.x - 40,
          top: centerY + userPosition.y - 40,
          width: 80,
          height: 80,
        }}
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        onMouseDown={() => setIsDragging(true)}
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center glow-primary relative">
          {/* Outer ring */}
          <div className="absolute inset-[-4px] rounded-full border-2 border-primary/50 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-[-8px] rounded-full border border-secondary/30 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
          
          <span className="font-display font-bold text-lg text-foreground">ME</span>
        </div>
      </motion.div>

      {/* Drag hint */}
      {!isDragging && userPosition.x === 0 && userPosition.y === 0 && (
        <motion.div 
          className="absolute left-1/2 bottom-4 -translate-x-1/2 text-xs text-muted-foreground glass px-3 py-1 rounded-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          Drag "ME" to simulate career paths
        </motion.div>
      )}
    </div>
  );
};

export default CareerGraph;
