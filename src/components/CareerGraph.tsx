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

  // Group careers by sector/domain
  const domains = useMemo(() => {
    const sectorMap: Record<string, CareerBubble[]> = {};
    bubbles.forEach(bubble => {
      if (!sectorMap[bubble.sector]) {
        sectorMap[bubble.sector] = [];
      }
      sectorMap[bubble.sector].push(bubble);
    });

    const sectorNames = Object.keys(sectorMap);
    const domainRadius = Math.min(dimensions.width, dimensions.height) * 0.28;

    return sectorNames.map((sector, index): DomainNode => {
      const angle = (index / sectorNames.length) * Math.PI * 2 - Math.PI / 2;
      const careers = sectorMap[sector];
      const avgFitScore = careers.reduce((sum, c) => sum + c.fitScore, 0) / careers.length;
      
      return {
        id: sector.toLowerCase().replace(/\s+/g, '-'),
        name: sector,
        x: centerX + userPosition.x + Math.cos(angle) * domainRadius,
        y: centerY + userPosition.y + Math.sin(angle) * domainRadius,
        size: 44 + (avgFitScore / 100) * 16,
        careers
      };
    });
  }, [bubbles, dimensions, centerX, centerY, userPosition]);

  // Calculate subdomain positions around each domain
  const getSubdomainPosition = (domain: DomainNode, careerIndex: number, totalCareers: number) => {
    const subRadius = 70 + (totalCareers > 4 ? 10 : 0);
    const startAngle = Math.atan2(domain.y - centerY - userPosition.y, domain.x - centerX - userPosition.x);
    const spreadAngle = Math.PI * 0.8;
    const angle = startAngle - spreadAngle / 2 + (careerIndex / Math.max(totalCareers - 1, 1)) * spreadAngle;
    
    return {
      x: domain.x + Math.cos(angle) * subRadius,
      y: domain.y + Math.sin(angle) * subRadius
    };
  };

  const getCareerSize = (bubble: CareerBubble) => {
    const baseSize = 18;
    const sizeMultiplier = bubble.fitScore / 100;
    return baseSize + (sizeMultiplier * 14);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
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
    
    const newX = e.clientX - rect.left - centerX - dragOffset.x;
    const newY = e.clientY - rect.top - centerY - dragOffset.y;
    
    const maxDrag = 100;
    setUserPosition({
      x: Math.max(-maxDrag, Math.min(maxDrag, newX)),
      y: Math.max(-maxDrag, Math.min(maxDrag, newY))
    });
  }, [isDragging, centerX, centerY, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-graph-bg"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Edge blur overlays */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-graph-bg via-graph-bg/90 via-60% to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-graph-bg via-graph-bg/60 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-graph-bg to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-graph-bg to-transparent z-[5] pointer-events-none" />

      {/* Connection lines */}
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
        
        {/* Lines from You to Domains */}
        {domains.map((domain, index) => (
          <motion.line
            key={`line-you-${domain.id}`}
            x1={centerX + userPosition.x}
            y1={centerY + userPosition.y}
            x2={domain.x}
            y2={domain.y}
            stroke="hsl(var(--graph-edge))"
            strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
          />
        ))}
        
        {/* Lines from Domains to Careers */}
        {domains.map((domain) =>
          domain.careers.map((career, careerIndex) => {
            if (!career.unlocked) return null;
            const pos = getSubdomainPosition(domain, careerIndex, domain.careers.length);
            return (
              <motion.line
                key={`line-${domain.id}-${career.id}`}
                x1={domain.x}
                y1={domain.y}
                x2={pos.x}
                y2={pos.y}
                stroke="hsl(var(--graph-edge))"
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 0.6, delay: 0.5 + careerIndex * 0.03 }}
              />
            );
          })
        )}
      </svg>

      {/* Domain Nodes (Big Circles) */}
      {domains.map((domain, index) => (
        <motion.div
          key={domain.id}
          className="absolute cursor-pointer"
          style={{
            left: domain.x - domain.size / 2,
            top: domain.y - domain.size / 2,
            width: domain.size,
            height: domain.size,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: "easeOut" }}
          whileHover={{ scale: 1.08, zIndex: 10 }}
        >
          <div className="w-full h-full rounded-full bg-graph-node-main/80" />
          <span className="absolute left-full ml-2 whitespace-nowrap text-graph-label font-semibold text-xs top-1/2 -translate-y-1/2">
            {domain.name}
          </span>
        </motion.div>
      ))}

      {/* Career Nodes (Subdomains) */}
      {domains.map((domain) =>
        domain.careers.map((career, careerIndex) => {
          const pos = getSubdomainPosition(domain, careerIndex, domain.careers.length);
          const size = getCareerSize(career);
          const isLocked = !career.unlocked;

          return (
            <motion.div
              key={career.id}
              className={`absolute ${isLocked ? 'opacity-30' : 'cursor-pointer'}`}
              style={{
                left: pos.x - size / 2,
                top: pos.y - size / 2,
                width: size,
                height: size,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + careerIndex * 0.04, ease: "easeOut" }}
              whileHover={!isLocked ? { scale: 1.15, zIndex: 15 } : undefined}
              whileTap={!isLocked ? { scale: 0.95 } : undefined}
              onClick={() => !isLocked && onBubbleClick(career)}
              onMouseEnter={() => !isLocked && onBubbleHover(career)}
              onMouseLeave={() => onBubbleHover(null)}
            >
              <div className="w-full h-full rounded-full bg-graph-node" />
              <span className="absolute left-full ml-1.5 whitespace-nowrap text-graph-label font-medium text-[10px] top-1/2 -translate-y-1/2 opacity-80">
                {career.name.split(' ')[0]}
              </span>
              {isLocked && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-graph-bg/60 backdrop-blur-sm">
                  <span className="text-[10px]">🔒</span>
                </div>
              )}
            </motion.div>
          );
        })
      )}

      {/* Center "You" Node */}
      <motion.div
        className={`absolute z-20 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: centerX + userPosition.x - 32,
          top: centerY + userPosition.y - 32,
          width: 64,
          height: 64,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full h-full rounded-full bg-graph-node-main" />
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
