import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';

const STATUSES = ['confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get('/orders/seller')
      .then(({ data }) => setOrders(data.orders || data.data?.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSkeleton variant="table" count={5} />;

  return (
    <div>
      <h1 className="section-title mb-6">Seller Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="glass-card">
            <div className="flex flex-wrap justify-between gap-4 mb-3">
              <div>
                <p className="font-semibold">#{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <span className="font-bold">₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
            <select className="input-field text-sm max-w-xs" value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        ))}
        {!orders.length && <div className="glass-card text-center py-12 text-slate-500">No orders yet</div>}
      </div>
    </div>
  );
};

export default SellerOrders;
