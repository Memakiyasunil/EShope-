import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments')
      .then(({ data }) => setPayments(data.payments || data.data?.payments || []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="table" count={6} />;

  return (
    <div>
      <h1 className="section-title mb-6">Payment Monitoring</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left p-3">Transaction</th><th className="text-left p-3">Method</th><th className="text-left p-3">Status</th><th className="text-left p-3">Date</th><th className="text-right p-3">Amount</th></tr></thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-3">{p.transactionId || p._id.slice(-8)}</td>
                <td className="p-3 capitalize">{p.method}</td>
                <td className="p-3"><StatusBadge status={p.status === 'completed' ? 'paid' : p.status} /></td>
                <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-3 text-right font-medium">₹{p.amount?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!payments.length && <p className="text-center py-8 text-slate-500">No payments found</p>}
      </div>
    </div>
  );
};

export default AdminPayments;
