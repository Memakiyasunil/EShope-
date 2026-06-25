import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, ShoppingBag, Users, Package, BarChart2, RefreshCw } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, ArcElement } from 'chart.js';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, ArcElement);

const AdminReports = () => {
  const [days, setDays] = useState(30);
  const [sales, setSales] = useState(null);
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [s, u, o] = await Promise.all([
        api.get(`/analytics/sales?days=${days}`),
        api.get(`/analytics/users?days=${days}`),
        api.get('/analytics/orders'),
      ]);
      setSales(s.data.data || s.data);
      setUsers(u.data.data || u.data);
      setOrders(o.data.data || o.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [days]);

  const salesByDay = sales?.salesByDay || [];
  const registrations = users?.registrationsByDay || [];

  const revenueChartData = {
    labels: salesByDay.map(d => d._id),
    datasets: [{
      label: 'Revenue (₹)',
      data: salesByDay.map(d => d.revenue),
      borderColor: '#4f46e5', backgroundColor: 'rgba(79,70,229,0.1)', tension: 0.4, fill: true,
    }],
  };

  const ordersChartData = {
    labels: salesByDay.map(d => d._id),
    datasets: [{
      label: 'Orders',
      data: salesByDay.map(d => d.orders),
      backgroundColor: 'rgba(16,185,129,0.8)', borderRadius: 6,
    }],
  };

  const userGrowthData = {
    labels: registrations.map(d => d._id),
    datasets: [{
      label: 'New Users',
      data: registrations.map(d => d.count),
      borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', tension: 0.4, fill: true,
    }],
  };

  const statusMap = {};
  (orders?.statusBreakdown || []).forEach(s => { statusMap[s._id] = s.count; });
  const orderStatusData = {
    labels: Object.keys(statusMap),
    datasets: [{ data: Object.values(statusMap), backgroundColor: ['#f59e0b','#3b82f6','#10b981','#ef4444','#ec4899','#8b5cf6','#06b6d4'], borderWidth: 0 }],
  };

  const chartOpts = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(148,163,184,0.1)' } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } } } };

  const totalRevenue = salesByDay.reduce((a, d) => a + (d.revenue || 0), 0);
  const totalOrders = salesByDay.reduce((a, d) => a + (d.orders || 0), 0);
  const totalNewUsers = registrations.reduce((a, d) => a + (d.count || 0), 0);

  const exportCSV = () => {
    const rows = [['Date','Orders','Revenue'], ...salesByDay.map(d => [d._id, d.orders, d.revenue])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`; a.download = `sales-report-${days}days.csv`; a.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Comprehensive platform insights</p>
        </div>
        <div className="flex gap-3">
          <select value={days} onChange={e => setDays(Number(e.target.value))} className="input-field text-sm py-2 px-3">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last 365 days</option>
          </select>
          <button onClick={fetchData} className="btn-outline text-sm py-2 px-4 flex items-center gap-2 rounded-xl">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportCSV} className="btn-primary text-sm py-2 px-4 flex items-center gap-2 rounded-xl">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: `Revenue (${days}d)`, value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-brand-600', bg: 'bg-brand-50 dark:bg-brand-900/20' },
          { label: `Orders (${days}d)`, value: totalOrders, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: `New Users (${days}d)`, value: totalNewUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          { label: 'Top Products', value: sales?.topProducts?.length || 0, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        ].map(s => (
          <GlassCard key={s.label} className={`p-5 ${s.bg}`}>
            <div className={`${s.color} mb-2`}><s.icon size={22} /></div>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-slate-500 font-medium mt-1">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {loading ? <LoadingSkeleton variant="card" count={4} /> : (
        <>
          {/* Revenue + Orders charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><TrendingUp size={18} className="text-brand-500" /> Revenue Trend</h2>
              {salesByDay.length > 0 ? <Line data={revenueChartData} options={chartOpts} /> : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data for this period</div>}
            </GlassCard>
            <GlassCard className="p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><ShoppingBag size={18} className="text-emerald-500" /> Orders Per Day</h2>
              {salesByDay.length > 0 ? <Bar data={ordersChartData} options={chartOpts} /> : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data</div>}
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* User Growth */}
            <GlassCard className="p-6 lg:col-span-2">
              <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2"><Users size={18} className="text-purple-500" /> User Registrations</h2>
              {registrations.length > 0 ? <Line data={userGrowthData} options={chartOpts} /> : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No registration data</div>}
            </GlassCard>
            {/* Order Status */}
            <GlassCard className="p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-5">Order Status Mix</h2>
              {Object.keys(statusMap).length > 0 ? (
                <Doughnut data={orderStatusData} options={{ plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } } }, cutout: '60%' }} />
              ) : <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data</div>}
            </GlassCard>
          </div>

          {/* Top Products */}
          {sales?.topProducts?.length > 0 && (
            <GlassCard className="p-0 overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><Package size={18} className="text-orange-500" /> Top Selling Products</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/70 dark:bg-slate-800/40">
                    <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500">
                      <th className="text-left px-5 py-3 font-bold text-[10px] uppercase tracking-widest">#</th>
                      <th className="text-left px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Product</th>
                      <th className="text-left px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Units Sold</th>
                      <th className="text-right px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Price</th>
                      <th className="text-right px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sales.topProducts.map((p, i) => (
                      <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3 text-slate-400 font-bold">#{i + 1}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                              <img src={p.images?.[0] || 'https://placehold.co/36/f1f5f9/334155?text=P'} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="font-bold text-emerald-600">{p.totalSold || 0}</span>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-slate-900 dark:text-white">₹{p.price?.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right text-yellow-600 font-semibold">★ {p.rating?.toFixed(1) || '0.0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AdminReports;
