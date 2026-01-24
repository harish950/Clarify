import { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  isMain?: boolean;
  isSecondary?: boolean;
}

interface Edge {
  from: string;
  to: string;
}

const LandingGraphPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });

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

  const { nodes, edges } = useMemo(() => {
    const w = dimensions.width;
    const h = dimensions.height;
    const cx = w / 2;
    const cy = h / 2 + 40; // Offset down to make room for header

    // Main center node
    const mainNode: Node = {
      id: 'you',
      label: 'You',
      x: cx,
      y: cy,
      size: 24,
      isMain: true
    };

    // Secondary nodes (career paths) - reduced and spread out more
    const secondaryNodes: Node[] = [
      { id: 'swe', label: 'Software Engineer', x: cx - 200, y: cy - 80, size: 14, isSecondary: true },
      { id: 'pm', label: 'Product Manager', x: cx + 200, y: cy - 60, size: 13, isSecondary: true },
      { id: 'ds', label: 'Data Scientist', x: cx - 160, y: cy + 100, size: 14, isSecondary: true },
      { id: 'ux', label: 'UX Designer', x: cx + 180, y: cy + 80, size: 12, isSecondary: true },
    ];

    // Tertiary nodes - simplified, fewer nodes
    const tertiaryNodes: Node[] = [
      { id: 'react', label: 'React', x: cx - 320, y: cy - 40, size: 6 },
      { id: 'python', label: 'Python', x: cx - 280, y: cy + 140, size: 6 },
      { id: 'figma', label: 'Figma', x: cx + 300, y: cy + 120, size: 6 },
      { id: 'agile', label: 'Agile', x: cx + 320, y: cy - 20, size: 6 },
    ];

    const allNodes = [mainNode, ...secondaryNodes, ...tertiaryNodes];

    // Create edges - simplified connections
    const edgeList: Edge[] = [
      // Main to secondary
      { from: 'you', to: 'swe' },
      { from: 'you', to: 'pm' },
      { from: 'you', to: 'ds' },
      { from: 'you', to: 'ux' },
      
      // Secondary to tertiary
      { from: 'swe', to: 'react' },
      { from: 'ds', to: 'python' },
      { from: 'ux', to: 'figma' },
      { from: 'pm', to: 'agile' },
      
      // Cross connections
      { from: 'swe', to: 'pm' },
      { from: 'ds', to: 'swe' },
    ];

    return { nodes: allNodes, edges: edgeList };
  }, [dimensions]);

  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-graph-bg rounded-xl"
    >
      {/* Header overlay */}
      <div className="absolute inset-x-0 top-0 z-10 p-8 md:p-12">
        <motion.h1 
          className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Navigate your career with{' '}
          <span className="text-graph-node-main">clarity</span>
        </motion.h1>
        <motion.p 
          className="text-graph-label/80 max-w-md text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Visualize career opportunities as an interactive map. See which roles fit your skills and how to get there.
        </motion.p>
      </div>

      {/* Edge lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge, i) => {
          const fromNode = getNodeById(edge.from);
          const toNode = getNodeById(edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <motion.line
              key={`edge-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="hsl(var(--graph-edge))"
              strokeWidth={fromNode.isMain || toNode.isMain ? 1.5 : 1}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: fromNode.isMain || toNode.isSecondary ? 0.6 : 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.02 }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute flex items-center"
          style={{
            left: node.x,
            top: node.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: node.isMain ? 0.2 : node.isSecondary ? 0.4 + i * 0.05 : 0.6 + i * 0.02,
            ease: "easeOut" 
          }}
        >
          {/* Node circle */}
          <div
            className={`rounded-full ${node.isMain ? 'bg-graph-node-main' : 'bg-graph-node'}`}
            style={{
              width: node.size * 2,
              height: node.size * 2,
            }}
          />
          
          {/* Label */}
          <span 
            className={`absolute whitespace-nowrap text-graph-label ${
              node.isMain 
                ? 'font-bold text-sm left-full ml-3' 
                : node.isSecondary 
                  ? 'font-medium text-xs left-full ml-2' 
                  : 'text-[10px] opacity-60 left-full ml-1.5'
            }`}
          >
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default LandingGraphPreview;
