import { motion } from 'framer-motion';

const Ripple = ({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className = "",
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_bottom,white,transparent)] ${className}`}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const borderStyle = i === numCircles - 1 ? "dashed" : "solid";

        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-slate-900/5 dark:bg-white/5 shadow-xl border border-slate-300 dark:border-slate-700"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderStyle,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [opacity, opacity * 0.8, opacity],
              scale: [1, 0.98, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default Ripple;
