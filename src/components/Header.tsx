import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeaderProps {
  variant?: 'default' | 'transparent';
  showNav?: boolean;
  rightContent?: React.ReactNode;
}

const Header = ({ variant = 'default', showNav = true, rightContent }: HeaderProps) => {
  const isTransparent = variant === 'transparent';
  
  return (
    <nav className={`flex items-center justify-between px-8 py-4 lg:px-16 ${
      isTransparent ? '' : 'border-b border-border bg-card'
    }`}>
      <motion.div 
        className="flex items-center gap-2" 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <span className={`text-lg font-semibold ${isTransparent ? 'text-white' : ''}`}>Clarity</span>
        </Link>
      </motion.div>

      {rightContent && (
        <motion.div 
          className="flex items-center gap-3" 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {rightContent}
        </motion.div>
      )}
    </nav>
  );
};

export default Header;
