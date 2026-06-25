import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Package, ShoppingBag, DollarSign, Store, Activity,
  ArrowUpRight, Wallet, Bell, Clock, TrendingUp, ShoppingCart,
  XCircle, CheckCircle, RefreshCw, BarChart2, Star, AlertCircle
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Tooltip, Legend, ArcElement, BarElement
} from 'chart.js';
import StatsCard from '../../components/common/StatsCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../utils/axios';
import { Link } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, ArcElement, BarElement);

const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } });

const AdminDashboard = () => {
  const [finances, setFinances] = useState(null);
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderAnalytics, setOrderAnalytics] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAll = async () => {
    try {
      const [financesRes, salesRes, ordersRes, orderAnRes, userAnRes] = await Promise.all([
        api.get('/analytics/finances'),
        api.get('/analytics/sales?days=30'),
        api.get('/orders/all?limit=8'),
        api.get('/analytics/orders'),
        api.get('/analytics/users?days=30'),
      ]);
      setFinances(financesRes.data.data || financesRes.data);
      const salesData = salesRes.data.data || salesRes.data;
      setSales(salesData?.salesByDay || []);
      setTopProducts(salesData?.topProducts || []);
      setOrders(ordersRes.data.data || []);
      setOrderAnalytics(orderAnRes.data.data || orderAnRes.data);
      setUserAnalytics(userAnRes.data.data || userAnRes.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  };

  if (loading) return <LoadingSkeleton variant="card" count={8} />;

  const salesChartData = {
    labels: sales.map((d) => d._id),
    datasets: [{
      label: 'Revenue (₹)',
      data: sales.map((d) => d.revenue),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79,70,229,0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#4f46e5',
      pointRadius: 4,
    }],
  };

  const statusMap = {};
  (orderAnalytics?.statusBreakdown || []).forEach(s => { statusMap[s._id] = s.count; });

  const orderStatusData = {
    labels: ['Pending', 'Confirmed', 'Delivered', 'Cancelled', 'Returned'],
    datasets: [{
      data: [
        statusMap.pending || 0,
        (statusMap.confirmed || 0) + (statusMap.processing || 0) + (statusMap.shipped || 0),
        statusMap.delivered || 0,
        statusMap.cancelled || 0,
        statusMap.returned || 0,
      ],
      backgroundColor: ['#f59e0b','#3b82f6','#10b981','#ef4444','#ec4899'],
      borderWidth: 0,
    }],
  };

  const userRoleMap = {};
  (userAnalytics?.usersByRole || []).forEach(r => { userRoleMap[r._id] = r.count; });

  const totalOrders = Object.values(statusMap).reduce((a, b) => a + b, 0);

  const chartOptions = { responsive: true, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(148,163,184,0.1)' } }, x: { grid: { display: false } } } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div {...fadeUp(0)}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Admin Control Center</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </motion.div>
        <motion.div {...fadeUp(0.1)} className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-outline text-sm py-2 px-4 rounded-xl flex items-center gap-2"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link to="/admin/finances" className="btn-primary text-sm py-2 px-5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 border-none shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            Financial Reports
          </Link>
        </motion.div>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard label="Total Revenue (All Time)" value={`₹${(finances?.totalTurnover || 0).toLocaleString()}`} icon={DollarSign} color="text-brand-500" trend={12.5} index={0} />
        <StatsCard label="Platform Income (10%)" value={`₹${(finances?.totalIncome || 0).toLocaleString()}`} icon={Activity} color="text-emerald-500" trend={8.2} index={1} />
        <StatsCard label="Sellers Wallet Balance" value={`₹${(finances?.totalWalletBalances || 0).toLocaleString()}`} icon={Wallet} color="text-purple-500" trend={-2.4} index={2} />
        <StatsCard label="Total Payouts" value={`₹${(finances?.totalGeneratedPayouts || 0).toLocaleString()}`} icon={ArrowUpRight} color="text-rose-500" trend={4.1} index={3} />
      </div>

      {/* Order KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "text-blue-500" },
          { label: "Pending", value: statusMap.pending || 0, icon: Clock, color: "text-yellow-500" },
          { label: "Delivered", value: statusMap.delivered || 0, icon: CheckCircle, color: "text-emerald-500" },
          { label: "Cancelled", value: statusMap.cancelled || 0, icon: XCircle, color: "text-red-500" },
          { label: "Returned", value: statusMap.returned || 0, icon: RefreshCw, color: "text-pink-500" },
          { label: "Avg Order Value", value: `₹${(orderAnalytics?.avgOrderValue || 0).toLocaleString()}`, icon: BarChart2, color: "text-indigo-500" },
        ].map((s, i) => (
          <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} index={i + 4} />
        ))}
      </div>

      {/* User KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Buyers", value: userRoleMap.buyer || 0, icon: Users, color: "text-blue-500" },
          { label: "Total Sellers", value: userRoleMap.seller || 0, icon: Store, color: "text-purple-500" },
          { label: "Active Members", value: finances?.activeMembers || 0, icon: TrendingUp, color: "text-emerald-500" },
          { label: "Today's Joinings", value: finances?.todayJoinings || 0, icon: Users, color: "text-cyan-500" },
          { label: "Pending Withdrawals", value: finances?.pendingFundRequests || 0, icon: AlertCircle, color: "text-orange-500" },
        ].map((s, i) => (
          <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} index={i + 10} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...fadeUp(0.3)} className="lg:col-span-2">
          <GlassCard className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-slate-900 dark:text-white">30-Day Revenue Trend</h2>
              <Link to="/admin/reports" className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">View Reports</Link>
            </div>
            {sales.length > 0
              ? <Line data={salesChartData} options={chartOptions} />
              : <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No sales data available</div>
            }
          </GlassCard>
        </motion.div>

        <motion.div {...fadeUp(0.4)}>
          <GlassCard className="p-6 h-full">
            <h2 className="font-extrabold text-slate-900 dark:text-white mb-6">Order Status Breakdown</h2>
            {totalOrders > 0 ? (
              <>
                <Doughnut data={orderStatusData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }, cutout: '65%' }} />
                <p className="text-center text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{totalOrders.toLocaleString()}</p>
                <p className="text-center text-xs text-slate-500">Total Orders</p>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No order data</div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Top Products + Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div {...fadeUp(0.5)}>
          <GlassCard className="p-0 overflow-hidden h-full">
            <div className="flex justify-between items-center p-5 border-b border-slate-200/50 dark:border-slate-800/50">
              <h2 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Star size={18} className="text-yellow-500" /> Top Products
              </h2>
              <Link to="/admin/products" className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">View All</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {topProducts.slice(0, 6).map((p, i) => (
                <div key={p._id} className="flex items-center gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <span className="text-xs font-black text-slate-400 w-5">#{i + 1}</span>
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                    <img src={p.images?.[0] || 'https://placehold.co/40x40/f1f5f9/334155?text=P'} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.totalSold || 0} sold · ₹{p.price?.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold">
                    <Star size={12} fill="currentColor" /> {p.rating?.toFixed(1) || '0.0'}
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No product data available</div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Orders */}
        <motion.div {...fadeUp(0.6)}>
          <GlassCard className="p-0 overflow-hidden h-full">
            <div className="flex justify-between items-center p-5 border-b border-slate-200/50 dark:border-slate-800/50">
              <h2 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-brand-500" /> Recent Orders
              </h2>
              <Link to="/admin/orders" className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">View All</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((o) => (
                <div key={o._id} className="flex items-center justify-between p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <div>
                    <p className="font-bold text-sm text-brand-600 dark:text-brand-400">#{o.orderNumber}</p>
                    <p className="text-xs text-slate-500">{o.user?.name || 'Unknown'} · {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <span className="font-bold text-sm text-slate-900 dark:text-white">₹{o.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">No recent orders</div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div {...fadeUp(0.7)}>
        <GlassCard className="p-6">
          <h2 className="font-extrabold text-slate-900 dark:text-white mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Users', to: '/admin/users', icon: Users, color: 'bg-blue-500' },
              { label: 'Sellers', to: '/admin/sellers', icon: Store, color: 'bg-purple-500' },
              { label: 'Orders', to: '/admin/orders', icon: ShoppingBag, color: 'bg-brand-500' },
              { label: 'Products', to: '/admin/products', icon: Package, color: 'bg-emerald-500' },
              { label: 'Categories', to: '/admin/categories', icon: BarChart2, color: 'bg-orange-500' },
              { label: 'Coupons', to: '/admin/coupons', icon: Activity, color: 'bg-pink-500' },
              { label: 'Reports', to: '/admin/reports', icon: TrendingUp, color: 'bg-cyan-500' },
              { label: 'Settings', to: '/admin/settings', icon: Bell, color: 'bg-slate-500' },
            ].map((a) => (
              <Link key={a.label} to={a.to} className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className={`w-10 h-10 ${a.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md`}>
                  <a.icon size={18} />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{a.label}</span>
              </Link>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
