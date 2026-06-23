import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const GlassCard = ({ children, className, hoverEffect = true, ...props }) => {
  return (
    <motion.div
      className={cn(
        'glass-card relative overflow-hidden',
        hoverEffect && 'hover:-translate-y-1',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
      {children}
    </motion.div>
  );
};

export default GlassCard;
