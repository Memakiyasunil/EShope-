const StatsCard = ({ label, value, icon: Icon, color = 'text-brand-600' }) => (
  <div className="glass-card flex items-center gap-4">
    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
      <Icon size={24} className={color} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

export default StatsCard;
