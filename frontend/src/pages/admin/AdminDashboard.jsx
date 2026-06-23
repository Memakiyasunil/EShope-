import { useEffect, useState } from 'react';
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Super Admin Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Complete e-commerce management statistics</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/settings" className="btn-outline text-sm py-2">Global Settings</Link>
          <Link to="/admin/finances" className="btn-primary text-sm py-2">Financial Reports</Link>
        </div>
      </div>

      {/* Top Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Turnover (All Time)" value={`₹${(finances?.totalTurnover || 0).toLocaleString()}`} icon={DollarSign} color="text-indigo-500" />
        <StatsCard label="Platform Income (10% Est)" value={`₹${(finances?.totalIncome || 0).toLocaleString()}`} icon={Activity} color="text-green-500" />
        <StatsCard label="Sellers Wallet Balance" value={`₹${(finances?.totalWalletBalances || 0).toLocaleString()}`} icon={Wallet} color="text-purple-500" />
        <StatsCard label="Total Payouts Generated" value={`₹${(finances?.totalGeneratedPayouts || 0).toLocaleString()}`} icon={ArrowUpRight} color="text-rose-500" />
      </div>

      {/* Daily & User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard label="Today's Turnover" value={`₹${(finances?.todayTurnover || 0).toLocaleString()}`} icon={DollarSign} color="text-emerald-500" />
        <StatsCard label="Today's Joinings" value={finances?.todayJoinings || 0} icon={Users} color="text-blue-500" />
        <StatsCard label="Active Members" value={finances?.activeMembers || 0} icon={Users} color="text-cyan-500" />
        <StatsCard label="Inactive Members" value={finances?.inactiveMembers || 0} icon={Store} color="text-slate-400" />
        <StatsCard label="Pending Withdrawals" value={finances?.pendingFundRequests || 0} icon={Clock} color="text-orange-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-6">
          <h2 className="font-semibold mb-4 text-slate-900 dark:text-white">30-Day Sales Trend</h2>
          {sales.length > 0 ? <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} /> : <p className="text-slate-500 text-sm">No data available</p>}
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Bell size={18}/> Notifications</h2>
            <Link to="/admin/settings" className="text-sm text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {finances?.recentNotifications?.length > 0 ? (
              finances.recentNotifications.map(n => (
                <div key={n._id} className="text-sm border-b border-slate-200 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{n.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{n.message}</p>
                  <span className="text-xs text-slate-400 mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No recent notifications</p>
            )}
          </div>
        </GlassCard>
      </div>
      
      <div className="glass-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">Latest Orders</h2>
          <Link to="/admin/orders" className="text-sm text-brand-600 hover:underline">View All Orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <th className="pb-3 font-medium">Order Number</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="py-3 font-medium text-brand-600 dark:text-brand-400">#{o.orderNumber}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-right font-medium text-slate-900 dark:text-white">₹{o.totalPrice?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
