import { motion } from 'framer-motion';
import CountUp from '../ui/CountUp';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ label, value, icon: Icon, color = 'text-brand-600', trend = 0, index = 0 }) => {
  let numericValue = 0;
  let prefix = '';
  let suffix = '';
  
  if (typeof value === 'string') {
    const match = value.match(/^([^0-9.-]*)([\d,.]+)([^0-9]*)$/);
    if (match) {
      prefix = match[1];
      numericValue = parseFloat(match[2].replace(/,/g, ''));
      suffix = match[3];
    } else {
      numericValue = parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
    }
  } else {
    numericValue = value;
  }

  const isPositive = trend >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-6 rounded-2xl relative group overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-150 duration-500 pointer-events-none">
        <Icon size={120} />
      </div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={24} />
        </div>
        
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
          {prefix}<CountUp end={numericValue} duration={2} decimals={numericValue % 1 !== 0 ? 2 : 0} />{suffix}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

export default StatsCard;
