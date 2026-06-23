import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Package, ShoppingBag, Tag, Star } from 'lucide-react';

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Simulate loading progress
  useEffect(() => {
    const duration = 3000; // 3 seconds loading phase
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // Loading dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Random floating icons config
  const floatingIcons = [
    { Icon: ShoppingCart, color: 'text-brand-500', size: 48, delay: 0, x: -30, y: -20 },
    { Icon: Package, color: 'text-purple-500', size: 56, delay: 0.5, x: 40, y: -30 },
    { Icon: ShoppingBag, color: 'text-orange-400', size: 40, delay: 1, x: 35, y: 30 },
    { Icon: Tag, color: 'text-pink-500', size: 32, delay: 1.5, x: -40, y: 20 },
    { Icon: Star, color: 'text-yellow-400', size: 28, delay: 0.8, x: -10, y: 40 },
    { Icon: ShoppingCart, color: 'text-blue-400', size: 36, delay: 2, x: 20, y: -45 },
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-slate-950"
    >
      {/* 1. Animated Gradient Background to match theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40" />

      {/* 2. Blurred Glowing Circles */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-400/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          translateY: [0, -50, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15],
          translateX: [0, 50, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-orange-400/20 blur-[80px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"
      />

      {/* 3. Floating eCommerce Elements */}
      {floatingIcons.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0.4, 0],
            scale: [0.5, 1, 1, 0.8],
            y: ['0vh', `${item.y}vh`],
            x: ['0vw', `${item.x}vw`],
            rotate: [0, 45, -45, 0]
          }}
          transition={{ 
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute ${item.color} drop-shadow-xl z-0 pointer-events-none`}
          style={{ top: '50%', left: '50%', marginTop: -item.size/2, marginLeft: -item.size/2 }}
        >
          <item.Icon size={item.size} strokeWidth={1.5} />
        </motion.div>
      ))}

      {/* Main Content Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center p-8 w-[90%] max-w-xl"
      >
        {/* Subtle circular rings behind logo */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full border border-slate-200/40 dark:border-slate-700/30 pointer-events-none" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-4 left-1/2 -translate-x-1/2 w-80 h-80 md:w-[400px] md:h-[400px] rounded-full border border-slate-200/20 dark:border-slate-700/20 pointer-events-none" 
        />

        {/* Pulse Glow */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/60 blur-[40px] rounded-full pointer-events-none"
        />

        {/* Logo */}
        <motion.img 
          src="/logo.png" 
          alt="E-Shope Logo" 
          className="w-40 h-40 md:w-56 md:h-56 object-contain mb-2 drop-shadow-xl relative z-10"
          initial={{ scale: 0.2, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: 'spring', bounce: 0.4 }}
          whileHover={{ scale: 1.05, rotate: 5 }}
        />

        {/* Brand Name */}
        <motion.h1 
          className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-orange-500 mb-2 drop-shadow-sm py-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          E-Shope
        </motion.h1>

        {/* Tagline */}
        <motion.div 
          className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 mb-10 text-center flex gap-1.5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 1 }
            }
          }}
        >
          {"Shop Smart, Live Better".split(' ').map((word, index) => (
            <motion.span 
              key={index}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className={index === 1 ? "text-blue-600 dark:text-blue-400 font-bold" : (index === 3 ? "text-orange-500 font-bold" : "")}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Loading Section */}
        <div className="w-full max-w-sm flex flex-col items-center">
          <div className="flex justify-between w-full mb-3 px-1">
            <motion.span 
              className="text-sm font-semibold text-slate-500 dark:text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Loading{dots}
            </motion.span>
            <motion.span 
              className="text-sm font-bold text-brand-600 dark:text-brand-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {progress}%
            </motion.span>
          </div>

          {/* Progress Bar Container */}
          <motion.div 
            className="h-2.5 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm p-0.5"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            {/* Progress Bar Fill */}
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-orange-500 rounded-full relative"
              style={{ width: `${progress}%` }}
              layout
            >
              {/* Glowing tip */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-[2px] rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
