import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CareerBubble } from '@/types/career';

interface CareerGraphProps {
  bubbles: CareerBubble[];
  onBubbleClick: (bubble: CareerBubble) => void;
  onBubbleHover: (bubble: CareerBubble | null) => void;
  timeMultiplier: number;
}

interface DomainNode {
  id: string;
  name: string;
  x: number;
  y: number;
  size: number;
  careers: CareerBubble[];
}

interface PositionedCareer {
  career: CareerBubble;
  x: number;
  y: number;
  size: number;
  labelSide: 'left' | 'right';
  domainId: string;
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

  // Group careers by sector/domain and position everything
  const { domains, positionedCareers } = useMemo(() => {
    const sectorMap: Record<string, CareerBubble[]> = {};
    bubbles.forEach(bubble => {
      if (!sectorMap[bubble.sector]) {
        sectorMap[bubble.sector] = [];
      }
      sectorMap[bubble.sector].push(bubble);
    });

    const sectorNames = Object.keys(sectorMap);
    const domainRadius = Math.min(dimensions.width, dimensions.height) * 0.26;

    // Position domains in quadrants to maximize space
    const domainAngles = [
      -Math.PI * 0.75,  // Top-left
      -Math.PI * 0.25,  // Top-right
      Math.PI * 0.25,   // Bottom-right
      Math.PI * 0.75,   // Bottom-left
    ];

    const domainNodes: DomainNode[] = sectorNames.map((sector, index): DomainNode => {
      const angle = domainAngles[index % 4];
      const careers = sectorMap[sector];
      
      return {
        id: sector.toLowerCase().replace(/\s+/g, '-'),
        name: sector,
        x: centerX + userPosition.x + Math.cos(angle) * domainRadius,
        y: centerY + userPosition.y + Math.sin(angle) * domainRadius,
        size: 32,
        careers
      };
    });

    // Position careers around their domains with more spacing
    const careers: PositionedCareer[] = [];
    
    domainNodes.forEach((domain, domainIndex) => {
      const careerCount = domain.careers.length;
      // Increase base radius for more spacing
      const careerRadius = 100 + Math.max(0, careerCount - 3) * 15;
      
      // Calculate angle offset so careers don't overlap between domains
      const domainAngle = domainAngles[domainIndex % 4];
      
      domain.careers.forEach((career, careerIndex) => {
        // Spread careers in arc facing away from center
        const arcSpread = Math.PI * 0.9;
        const startAngle = domainAngle - arcSpread / 2;
        const angle = startAngle + (careerIndex / Math.max(careerCount - 1, 1)) * arcSpread;
        
        const x = domain.x + Math.cos(angle) * careerRadius;
        const y = domain.y + Math.sin(angle) * careerRadius;
        
        // Label goes opposite to the domain center
        const careerIsOnRight = x > domain.x;
        
        careers.push({
          career,
          x,
          y,
          size: 20 + (career.fitScore / 100) * 10,
          labelSide: careerIsOnRight ? 'right' : 'left',
          domainId: domain.id
        });
      });
    });

    return { domains: domainNodes, positionedCareers: careers };
  }, [bubbles, dimensions, centerX, centerY, userPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Allow dragging from anywhere on the canvas
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - userPosition.x,
      y: e.clientY - userPosition.y
    });
  }, [userPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const maxDrag = 150;
    setUserPosition({
      x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
      y: Math.max(-maxDrag, Math.min(maxDrag, newY))
    });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden bg-graph-bg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Edge blur overlays */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-graph-bg via-graph-bg/80 via-50% to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-graph-bg via-graph-bg/60 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-graph-bg to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-graph-bg to-transparent z-[5] pointer-events-none" />

      {/* Connection lines */}
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
        
        {/* Lines from You to Domains */}
        {domains.map((domain, index) => (
          <motion.line
            key={`line-you-${domain.id}`}
            x1={centerX + userPosition.x}
            y1={centerY + userPosition.y}
            x2={domain.x}
            y2={domain.y}
            stroke="hsl(var(--graph-edge))"
            strokeWidth={1.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
          />
        ))}
        
        {/* Lines from Domains to Careers */}
        {positionedCareers.map((pc, index) => {
          const domain = domains.find(d => d.id === pc.domainId);
          if (!domain) return null;
          
          return (
            <motion.line
              key={`line-career-${pc.career.id}`}
              x1={domain.x}
              y1={domain.y}
              x2={pc.x}
              y2={pc.y}
              stroke="hsl(var(--graph-edge))"
              strokeWidth={1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: pc.career.unlocked ? 0.5 : 0.2 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.02 }}
            />
          );
        })}
      </svg>

      {/* Domain Nodes */}
      {domains.map((domain, index) => {
        const isOnRight = domain.x > centerX + userPosition.x;
        
        return (
          <motion.div
            key={domain.id}
            className="absolute"
            style={{
              left: domain.x - domain.size / 2,
              top: domain.y - domain.size / 2,
              width: domain.size,
              height: domain.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 + index * 0.08, ease: "easeOut" }}
          >
            <div className="w-full h-full rounded-full bg-graph-node-main/70" />
            <span 
              className={`absolute whitespace-nowrap text-graph-label font-semibold text-[11px] top-1/2 -translate-y-1/2 ${
                isOnRight ? 'left-full ml-2' : 'right-full mr-2 text-right'
              }`}
            >
              {domain.name}
            </span>
          </motion.div>
        );
      })}

      {/* Career Nodes */}
      {positionedCareers.map((pc, index) => {
        const isLocked = !pc.career.unlocked;

        return (
          <motion.div
            key={pc.career.id}
            className={`absolute ${isLocked ? 'opacity-25' : 'cursor-pointer'}`}
            style={{
              left: pc.x - pc.size / 2,
              top: pc.y - pc.size / 2,
              width: pc.size,
              height: pc.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: isLocked ? 0.25 : 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.025, ease: "easeOut" }}
            whileHover={!isLocked ? { scale: 1.2, zIndex: 15 } : undefined}
            whileTap={!isLocked ? { scale: 0.95 } : undefined}
            onClick={() => !isLocked && onBubbleClick(pc.career)}
            onMouseEnter={() => !isLocked && onBubbleHover(pc.career)}
            onMouseLeave={() => onBubbleHover(null)}
          >
            <div className="w-full h-full rounded-full bg-graph-node" />
            <span 
              className={`absolute whitespace-nowrap text-graph-label font-medium text-[9px] top-1/2 -translate-y-1/2 opacity-70 ${
                pc.labelSide === 'right' ? 'left-full ml-1' : 'right-full mr-1 text-right'
              }`}
            >
              {pc.career.name.length > 12 ? pc.career.name.split(' ')[0] : pc.career.name}
            </span>
            {isLocked && (
              <div className="absolute inset-0 rounded-full flex items-center justify-center bg-graph-bg/50">
                <span className="text-[8px]">🔒</span>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Center "You" Node */}
      <motion.div
        className="absolute z-20"
        style={{
          left: centerX + userPosition.x - 28,
          top: centerY + userPosition.y - 28,
          width: 56,
          height: 56,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="w-full h-full rounded-full bg-graph-node-main" />
        <span className="absolute left-full ml-3 whitespace-nowrap text-graph-label font-bold text-sm top-1/2 -translate-y-1/2">
          You
        </span>
      </motion.div>

      {/* Drag hint */}
      {!isDragging && userPosition.x === 0 && userPosition.y === 0 && (
        <motion.div 
          className="absolute left-1/2 bottom-6 -translate-x-1/2 text-xs text-graph-label/70 bg-graph-bg/80 backdrop-blur-sm px-4 py-2 rounded-full border border-graph-edge/30 z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          Drag anywhere to explore
        </motion.div>
      )}
    </div>
  );
};

export default CareerGraph;
