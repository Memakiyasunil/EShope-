import { useEffect, useState } from 'react';
import { Users, Package, ShoppingBag, DollarSign, Store } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import StatsCard from '../../components/common/StatsCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import api from '../../utils/axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/dashboard'),
      api.get('/analytics/sales?days=30'),
      api.get('/orders?limit=5'),
    ]).then(([dash, salesRes, ordersRes]) => {
      const d = dash.data.data || dash.data;
      setStats(d.stats || d);
      setSales(salesRes.data.data?.salesByDay || salesRes.data.salesByDay || []);
      setOrders(ordersRes.data.orders || ordersRes.data.data?.orders || d.recentOrders || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={4} />;

  const chartData = {
    labels: sales.map((d) => d._id),
    datasets: [{ label: 'Revenue', data: sales.map((d) => d.revenue), borderColor: '#4f46e5', tension: 0.4 }],
  };

  return (
    <div>
      <h1 className="section-title mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard label="Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="text-green-500" />
        <StatsCard label="Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} color="text-blue-500" />
        <StatsCard label="Products" value={stats?.totalProducts || 0} icon={Package} color="text-purple-500" />
        <StatsCard label="Customers" value={stats?.totalUsers || 0} icon={Users} color="text-orange-500" />
        <StatsCard label="Sellers" value={stats?.totalSellers || 0} icon={Store} color="text-cyan-500" />
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h2 className="font-semibold mb-4">Monthly Sales</h2>
          {sales.length > 0 ? <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} /> : <p className="text-slate-500 text-sm">No data</p>}
        </div>
        <div className="glass-card">
          <h2 className="font-semibold mb-4">Latest Orders</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o._id} className="flex justify-between items-center text-sm">
                <span>#{o.orderNumber}</span>
                <StatusBadge status={o.status} />
                <span className="font-medium">₹{o.totalPrice?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
