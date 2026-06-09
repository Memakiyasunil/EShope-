import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/orders?page=${page}&limit=15`)
      .then(({ data }) => {
        setOrders(data.orders || data.data?.orders || []);
        setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSkeleton variant="table" count={8} />;

  return (
    <div>
      <h1 className="section-title mb-6">Order Management</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left p-3">Order</th><th className="text-left p-3">Customer</th><th className="text-left p-3">Status</th><th className="text-left p-3">Payment</th><th className="text-right p-3">Total</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b">
                <td className="p-3">#{o.orderNumber}</td>
                <td className="p-3">{o.user?.name || '—'}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 capitalize">{o.paymentMethod}</td>
                <td className="p-3 text-right font-medium">₹{o.totalPrice?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AdminOrders;
