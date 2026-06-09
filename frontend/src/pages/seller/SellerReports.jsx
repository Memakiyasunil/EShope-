import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const SellerReports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/seller?days=30')
      .then(({ data: res }) => {
        const sales = res.data?.salesByDay || res.salesByDay || [];
        setData(sales.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={2} />;

  return (
    <div>
      <h1 className="section-title mb-6">Sales Reports</h1>
      <div className="glass-card">
        <h2 className="font-semibold mb-4">Last 30 Days</h2>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-slate-500">No report data available</p>}
      </div>
    </div>
  );
};

export default SellerReports;
