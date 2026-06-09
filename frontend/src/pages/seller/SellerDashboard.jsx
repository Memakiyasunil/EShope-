import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Star } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import StatsCard from '../../components/common/StatsCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api from '../../utils/axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/seller')
      .then(({ data: res }) => setData(res.data || res))
      .catch(() => setData({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, avgRating: 0, salesByDay: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={4} />;

  const chartData = {
    labels: data?.salesByDay?.map((d) => d._id) || [],
    datasets: [{ label: 'Revenue (₹)', data: data?.salesByDay?.map((d) => d.revenue) || [], borderColor: '#4f46e5', tension: 0.4, fill: false }],
  };

  return (
    <div>
      <h1 className="section-title mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Revenue" value={`₹${(data?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="text-green-500" />
        <StatsCard label="Orders" value={data?.totalOrders || 0} icon={ShoppingBag} color="text-blue-500" />
        <StatsCard label="Products" value={data?.totalProducts || 0} icon={Package} color="text-purple-500" />
        <StatsCard label="Rating" value={data?.avgRating || '0'} icon={Star} color="text-yellow-500" />
      </div>
      <div className="glass-card mb-6">
        <h2 className="font-semibold mb-4">Sales Overview</h2>
        {data?.salesByDay?.length > 0 ? <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} /> : <p className="text-slate-500 text-sm">No sales data yet</p>}
      </div>
      <div className="flex gap-4">
        <Link to="/dashboard/seller/products" className="btn-primary">Manage Products</Link>
        <Link to="/dashboard/seller/orders" className="btn-outline">View Orders</Link>
      </div>
    </div>
  );
};

export default SellerDashboard;
