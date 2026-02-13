import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';

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

const DemoPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [tick, setTick] = useState(0);

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

  // Continuous animation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const { nodes, edges } = useMemo(() => {
    const w = dimensions.width;
    const h = dimensions.height;
    const cx = w / 2;
    const cy = h / 2;

    const mainNode: Node = {
      id: 'you', label: 'You', x: cx, y: cy, size: 28, isMain: true
    };

    const secondaryNodes: Node[] = [
      { id: 'swe', label: 'Software Engineer', x: cx - w * 0.22, y: cy - 80, size: 18, isSecondary: true },
      { id: 'pm', label: 'Product Manager', x: cx + w * 0.20, y: cy - 60, size: 16, isSecondary: true },
      { id: 'ds', label: 'Data Scientist', x: cx - w * 0.18, y: cy + 100, size: 17, isSecondary: true },
      { id: 'ux', label: 'UX Designer', x: cx + w * 0.22, y: cy + 70, size: 15, isSecondary: true },
      { id: 'devops', label: 'DevOps', x: cx + w * 0.08, y: cy - 130, size: 12, isSecondary: true },
      { id: 'ml', label: 'ML Engineer', x: cx - w * 0.08, y: cy + 140, size: 14, isSecondary: true },
    ];

    const tertiaryNodes: Node[] = [
      { id: 'react', label: 'React', x: cx - w * 0.32, y: cy - 40, size: 8 },
      { id: 'node', label: 'Node.js', x: cx - w * 0.28, y: cy - 140, size: 7 },
      { id: 'typescript', label: 'TypeScript', x: cx - w * 0.38, y: cy - 100, size: 6 },
      { id: 'api', label: 'APIs', x: cx - w * 0.12, y: cy - 140, size: 7 },
      { id: 'agile', label: 'Agile', x: cx + w * 0.32, y: cy - 100, size: 7 },
      { id: 'roadmap', label: 'Roadmaps', x: cx + w * 0.30, y: cy - 10, size: 6 },
      { id: 'analytics', label: 'Analytics', x: cx + w * 0.12, y: cy - 20, size: 6 },
      { id: 'python', label: 'Python', x: cx - w * 0.30, y: cy + 80, size: 8 },
      { id: 'sql', label: 'SQL', x: cx - w * 0.24, y: cy + 160, size: 6 },
      { id: 'stats', label: 'Statistics', x: cx - w * 0.06, y: cy + 60, size: 5 },
      { id: 'figma', label: 'Figma', x: cx + w * 0.34, y: cy + 120, size: 7 },
      { id: 'research', label: 'Research', x: cx + w * 0.30, y: cy + 30, size: 5 },
      { id: 'proto', label: 'Prototyping', x: cx + w * 0.14, y: cy + 140, size: 6 },
      { id: 'docker', label: 'Docker', x: cx + w * 0.16, y: cy - 160, size: 6 },
      { id: 'ci', label: 'CI/CD', x: cx - w * 0.02, y: cy - 160, size: 5 },
      { id: 'tensorflow', label: 'TensorFlow', x: cx - w * 0.18, y: cy + 180, size: 5 },
      { id: 'nlp', label: 'NLP', x: cx + w * 0.04, y: cy + 180, size: 5 },
    ];

    const allNodes = [mainNode, ...secondaryNodes, ...tertiaryNodes];

    const edgeList: Edge[] = [
      { from: 'you', to: 'swe' }, { from: 'you', to: 'pm' }, { from: 'you', to: 'ds' },
      { from: 'you', to: 'ux' }, { from: 'you', to: 'devops' }, { from: 'you', to: 'ml' },
      { from: 'swe', to: 'react' }, { from: 'swe', to: 'node' }, { from: 'swe', to: 'typescript' },
      { from: 'swe', to: 'api' }, { from: 'pm', to: 'agile' }, { from: 'pm', to: 'roadmap' },
      { from: 'pm', to: 'analytics' }, { from: 'ds', to: 'python' }, { from: 'ds', to: 'sql' },
      { from: 'ds', to: 'stats' }, { from: 'ux', to: 'figma' }, { from: 'ux', to: 'research' },
      { from: 'ux', to: 'proto' }, { from: 'devops', to: 'docker' }, { from: 'devops', to: 'ci' },
      { from: 'ml', to: 'tensorflow' }, { from: 'ml', to: 'nlp' },
      { from: 'swe', to: 'devops' }, { from: 'ds', to: 'ml' }, { from: 'pm', to: 'analytics' },
      { from: 'python', to: 'tensorflow' }, { from: 'api', to: 'analytics' },
    ];

    return { nodes: allNodes, edges: edgeList };
  }, [dimensions]);

  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  // Highlight a different secondary node every tick
  const secondaryIds = ['swe', 'pm', 'ds', 'ux', 'devops', 'ml'];
  const highlightedId = secondaryIds[tick % secondaryIds.length];

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-graph-bg cursor-default select-none">
      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-graph-bg/80 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-graph-bg/80 to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-graph-bg to-transparent z-[5] pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-graph-bg to-transparent z-[5] pointer-events-none" />

      {/* Branding */}
      <div className="absolute top-6 left-8 z-10 flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">C</span>
        </div>
        <span className="text-lg font-semibold text-white">Clarity</span>
      </div>

      {/* Tagline */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center">
        <motion.p
          className="text-white/80 text-lg font-medium"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          Navigate your career with Clarity
        </motion.p>
      </div>

      {/* Graph content */}
      <div className="absolute inset-0">
      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="glow-demo" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((edge, i) => {
          const fromNode = getNodeById(edge.from);
          const toNode = getNodeById(edge.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted =
            edge.from === highlightedId || edge.to === highlightedId ||
            (edge.from === 'you' && edge.to === highlightedId);

          const cx = dimensions.width / 2;
          const cy = dimensions.height / 2;

          return (
            <motion.line
              key={`edge-${i}`}
              initial={{
                x1: cx, y1: cy, x2: cx, y2: cy, opacity: 0,
              }}
              animate={{
                x1: fromNode.x, y1: fromNode.y,
                x2: toNode.x, y2: toNode.y,
                opacity: isHighlighted ? [0.4, 0.9, 0.4] : (fromNode.isMain || toNode.isSecondary ? 0.5 : 0.25),
              }}
              transition={{
                x1: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                y1: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                x2: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                y2: { duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] },
                opacity: isHighlighted
                  ? { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
                  : { duration: 0.8, delay: 0.8 },
              }}
              stroke={isHighlighted ? 'hsl(var(--primary))' : 'hsl(var(--graph-edge))'}
              strokeWidth={isHighlighted ? 2 : 1}
              filter={isHighlighted ? 'url(#glow-demo)' : undefined}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, idx) => {
        const diameter = node.size * 2;
        const isHighlighted = node.id === highlightedId;
        const isConnectedToHighlight = edges.some(
          e => (e.from === highlightedId && e.to === node.id) || (e.to === highlightedId && e.from === node.id)
        );

        const cx = dimensions.width / 2;
        const cy = dimensions.height / 2;
        const spawnDelay = node.isMain ? 0 : node.isSecondary ? 0.15 + idx * 0.05 : 0.4 + idx * 0.03;

        return (
          <motion.div
            key={node.id}
            className="absolute"
            style={{
              width: diameter,
              height: diameter,
            }}
            initial={{
              left: cx - diameter / 2,
              top: cy - diameter / 2,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              left: node.x - diameter / 2,
              top: node.y - diameter / 2,
              opacity: 1,
              scale: node.isMain ? 1 : isHighlighted ? [1, 1.3, 1] : isConnectedToHighlight ? [1, 1.1, 1] : 1,
            }}
            transition={{
              left: { duration: 1.2, delay: spawnDelay, ease: [0.16, 1, 0.3, 1] },
              top: { duration: 1.2, delay: spawnDelay, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.6, delay: spawnDelay },
              scale: isHighlighted || isConnectedToHighlight
                ? { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: spawnDelay + 1.2 }
                : { duration: 0.6, delay: spawnDelay },
            }}
          >
            {/* Glow ring for highlighted */}
            {isHighlighted && (
              <motion.div
                className="absolute inset-[-6px] rounded-full border-2 border-primary/50"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            <div
              className={`w-full h-full rounded-full ${
                node.isMain ? 'bg-graph-node-main' : isHighlighted ? 'bg-primary' : 'bg-graph-node'
              }`}
            />

            <span
              className={`absolute whitespace-nowrap top-1/2 -translate-y-1/2 ${
                node.isMain
                  ? 'font-bold text-sm left-full ml-3 text-white'
                  : node.isSecondary
                    ? `font-medium text-xs left-full ml-2 ${isHighlighted ? 'text-primary-foreground' : 'text-graph-label'}`
                    : `text-[10px] left-full ml-1.5 ${isConnectedToHighlight ? 'text-graph-label opacity-80' : 'text-graph-label opacity-50'}`
              }`}
            >
              {node.label}
            </span>
          </motion.div>
        );
      })}
      </div>{/* end camera drift wrapper */}
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${10 + (i * 4.2) % 80}%`,
            top: `${15 + (i * 3.7) % 70}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default DemoPage;
