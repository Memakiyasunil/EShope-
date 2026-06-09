import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/orders/my-orders?page=${page}&limit=10`)
      .then(({ data }) => {
        setOrders(data.orders || data.data?.orders || []);
        setTotalPages(data.totalPages || data.pagination?.totalPages || 1);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSkeleton variant="table" count={5} />;

  return (
    <div>
      <h1 className="section-title mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="glass-card text-center py-12 text-slate-500">No orders yet. Start shopping!</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-card">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">#{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="font-bold text-brand-600">₹{order.totalPrice?.toLocaleString()}</span>
                  <Link to={`/dashboard/orders/${order._id}`} className="btn-outline text-sm py-1.5 px-3">
                    <Eye size={16} /> View
                  </Link>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {order.items?.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 shrink-0 text-sm text-slate-600 dark:text-slate-400">
                    {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />}
                    <span>{item.name} × {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default Orders;
