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

  const { nodes, edges, backgroundDots } = useMemo(() => {
    const w = dimensions.width;
    const h = dimensions.height;
    const cx = w / 2;
    const cy = h / 2;

    // Main center node
    const mainNode: Node = {
      id: 'you',
      label: 'You',
      x: cx,
      y: cy,
      size: 28,
      isMain: true
    };

    // Secondary nodes (career paths)
    const secondaryNodes: Node[] = [
      { id: 'swe', label: 'Software Engineer', x: cx - 180, y: cy - 100, size: 18, isSecondary: true },
      { id: 'pm', label: 'Product Manager', x: cx + 160, y: cy - 80, size: 16, isSecondary: true },
      { id: 'ds', label: 'Data Scientist', x: cx - 140, y: cy + 120, size: 17, isSecondary: true },
      { id: 'ux', label: 'UX Designer', x: cx + 180, y: cy + 90, size: 15, isSecondary: true },
      { id: 'devops', label: 'DevOps', x: cx + 60, y: cy - 150, size: 12, isSecondary: true },
      { id: 'ml', label: 'ML Engineer', x: cx - 60, y: cy + 160, size: 14, isSecondary: true },
    ];

    // Tertiary nodes (skills, concepts)
    const tertiaryNodes: Node[] = [
      // Around Software Engineer
      { id: 'react', label: 'React', x: cx - 280, y: cy - 60, size: 8 },
      { id: 'node', label: 'Node.js', x: cx - 240, y: cy - 160, size: 7 },
      { id: 'typescript', label: 'TypeScript', x: cx - 320, y: cy - 130, size: 6 },
      { id: 'api', label: 'APIs', x: cx - 100, y: cy - 160, size: 7 },
      
      // Around Product Manager
      { id: 'agile', label: 'Agile', x: cx + 280, y: cy - 120, size: 7 },
      { id: 'roadmap', label: 'Roadmaps', x: cx + 250, y: cy - 30, size: 6 },
      { id: 'analytics', label: 'Analytics', x: cx + 100, y: cy - 40, size: 6 },
      
      // Around Data Scientist
      { id: 'python', label: 'Python', x: cx - 260, y: cy + 100, size: 8 },
      { id: 'sql', label: 'SQL', x: cx - 200, y: cy + 180, size: 6 },
      { id: 'stats', label: 'Statistics', x: cx - 60, y: cy + 80, size: 5 },
      
      // Around UX Designer
      { id: 'figma', label: 'Figma', x: cx + 280, y: cy + 140, size: 7 },
      { id: 'research', label: 'Research', x: cx + 240, y: cy + 50, size: 5 },
      { id: 'proto', label: 'Prototyping', x: cx + 120, y: cy + 160, size: 6 },
      
      // Around DevOps
      { id: 'docker', label: 'Docker', x: cx + 140, y: cy - 180, size: 6 },
      { id: 'ci', label: 'CI/CD', x: cx - 20, y: cy - 180, size: 5 },
      
      // Around ML
      { id: 'tensorflow', label: 'TensorFlow', x: cx - 160, y: cy + 200, size: 5 },
      { id: 'nlp', label: 'NLP', x: cx + 40, y: cy + 200, size: 5 },
    ];

    const allNodes = [mainNode, ...secondaryNodes, ...tertiaryNodes];

    // Create edges
    const edgeList: Edge[] = [
      // Main to secondary
      { from: 'you', to: 'swe' },
      { from: 'you', to: 'pm' },
      { from: 'you', to: 'ds' },
      { from: 'you', to: 'ux' },
      { from: 'you', to: 'devops' },
      { from: 'you', to: 'ml' },
      
      // Secondary to tertiary
      { from: 'swe', to: 'react' },
      { from: 'swe', to: 'node' },
      { from: 'swe', to: 'typescript' },
      { from: 'swe', to: 'api' },
      { from: 'pm', to: 'agile' },
      { from: 'pm', to: 'roadmap' },
      { from: 'pm', to: 'analytics' },
      { from: 'ds', to: 'python' },
      { from: 'ds', to: 'sql' },
      { from: 'ds', to: 'stats' },
      { from: 'ux', to: 'figma' },
      { from: 'ux', to: 'research' },
      { from: 'ux', to: 'proto' },
      { from: 'devops', to: 'docker' },
      { from: 'devops', to: 'ci' },
      { from: 'ml', to: 'tensorflow' },
      { from: 'ml', to: 'nlp' },
      
      // Cross connections
      { from: 'swe', to: 'devops' },
      { from: 'ds', to: 'ml' },
      { from: 'pm', to: 'analytics' },
      { from: 'python', to: 'tensorflow' },
      { from: 'api', to: 'analytics' },
    ];

    // Background scattered dots
    const dots = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    return { nodes: allNodes, edges: edgeList, backgroundDots: dots };
  }, [dimensions]);

  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-graph-bg rounded-xl"
    >

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
