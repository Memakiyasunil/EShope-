import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'];

const AdminReports = () => {
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/sales?days=30'),
      api.get('/analytics/users?days=30'),
    ]).then(([salesRes, usersRes]) => {
      setSales(salesRes.data.data?.salesByDay || salesRes.data.salesByDay || []);
      setUsers(usersRes.data.data?.usersByRole || usersRes.data.usersByRole || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={2} />;

  const userData = users.map((u) => ({ name: u._id, value: u.count }));

  return (
    <div>
      <h1 className="section-title mb-6">Reports & Analytics</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card">
          <h2 className="font-semibold mb-4">Sales (30 days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sales.map((d) => ({ date: d._id, revenue: d.revenue }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card">
          <h2 className="font-semibold mb-4">Users by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {userData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
