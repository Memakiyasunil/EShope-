import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, ShoppingBag, DollarSign, Store, Activity, ArrowUpRight, Wallet, Bell, Clock } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import StatsCard from '../../components/common/StatsCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../utils/axios';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [finances, setFinances] = useState(null);
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/finances'),
      api.get('/analytics/sales?days=30'),
      api.get('/orders/all?limit=5'),
    ]).then(([financesRes, salesRes, ordersRes]) => {
      setFinances(financesRes.data.data || financesRes.data);
      setSales(salesRes.data.data?.salesByDay || salesRes.data.salesByDay || []);
      setOrders(ordersRes.data.data || []);
    }).catch((err) => console.error(err)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={4} />;

  const chartData = {
    labels: sales.map((d) => d._id),
    datasets: [{ label: 'Revenue', data: sales.map((d) => d.revenue), borderColor: '#4f46e5', tension: 0.4 }],
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 relative"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Super Admin Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Complete e-commerce management statistics</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="flex gap-3">
          <Link to="/admin/settings" className="btn-outline text-sm py-2 px-6 rounded-xl shadow-sm hover:shadow-brand-500/20 hover:bg-brand-50/50 backdrop-blur-md">Global Settings</Link>
          <Link to="/admin/finances" className="btn-primary text-sm py-2 px-6 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-brand-600 to-purple-600 border-none">Financial Reports</Link>
        </motion.div>
      </div>

      {/* Top Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <StatsCard label="Total Turnover (All Time)" value={`₹${(finances?.totalTurnover || 0).toLocaleString()}`} icon={DollarSign} color="text-brand-500" trend={12.5} index={0} />
        <StatsCard label="Platform Income (10% Est)" value={`₹${(finances?.totalIncome || 0).toLocaleString()}`} icon={Activity} color="text-emerald-500" trend={8.2} index={1} />
        <StatsCard label="Sellers Wallet Balance" value={`₹${(finances?.totalWalletBalances || 0).toLocaleString()}`} icon={Wallet} color="text-purple-500" trend={-2.4} index={2} />
        <StatsCard label="Total Payouts Generated" value={`₹${(finances?.totalGeneratedPayouts || 0).toLocaleString()}`} icon={ArrowUpRight} color="text-rose-500" trend={4.1} index={3} />
      </div>

      {/* Daily & User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
        <StatsCard label="Today's Turnover" value={`₹${(finances?.todayTurnover || 0).toLocaleString()}`} icon={DollarSign} color="text-emerald-500" trend={15.3} index={4} />
        <StatsCard label="Today's Joinings" value={finances?.todayJoinings || 0} icon={Users} color="text-blue-500" index={5} />
        <StatsCard label="Active Members" value={finances?.activeMembers || 0} icon={Users} color="text-cyan-500" index={6} />
        <StatsCard label="Inactive Members" value={finances?.inactiveMembers || 0} icon={Store} color="text-slate-400" index={7} />
        <StatsCard label="Pending Withdrawals" value={finances?.pendingFundRequests || 0} icon={Clock} color="text-orange-500" index={8} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
          <GlassCard className="p-6 h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <h2 className="font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">30-Day Sales Trend</h2>
            {sales.length > 0 ? <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(148, 163, 184, 0.1)' } }, x: { grid: { display: false } } } }} /> : <p className="text-slate-500 text-sm">No data available</p>}
          </GlassCard>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <GlassCard className="p-0 h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
              <h2 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight"><Bell size={18} className="text-brand-500" /> Notifications</h2>
              <Link to="/admin/settings" className="text-[10px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 uppercase tracking-widest">View All</Link>
            </div>
            <div className="p-4 flex-1 overflow-y-auto max-h-[350px] scrollbar-thin">
              {finances?.recentNotifications?.length > 0 ? (
                finances.recentNotifications.map(n => (
                  <div key={n._id} className="p-4 mb-3 last:mb-0 rounded-2xl bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group cursor-pointer shadow-sm">
                    <p className="text-slate-900 dark:text-white font-bold text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{n.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mt-1.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-bold uppercase tracking-wider">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
                  <Bell size={40} className="text-slate-400 mb-3" />
                  <p className="text-sm font-bold text-slate-500">All caught up!</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative z-10">
        <GlassCard className="p-0 overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-white/50 dark:border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <div className="flex justify-between items-center p-6 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
            <h2 className="font-extrabold text-slate-900 dark:text-white tracking-tight">Latest Orders</h2>
            <Link to="/admin/orders" className="text-[10px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 uppercase tracking-widest">View All Orders</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30">
                <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-slate-500">
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Order Number</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">#{o.orderNumber}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">₹{o.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>

    </motion.div>
  );
};

export default AdminDashboard;
