import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, XCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';

const ORDER_STATUSES = ['pending','confirmed','processing','packed','shipped','out_for_delivery','delivered','cancelled','returned','refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (statusFilter) params.set('status', statusFilter);
    if (paymentFilter) params.set('paymentStatus', paymentFilter);
    api.get(`/orders/all?${params}`)
      .then(({ data }) => {
        setOrders(data.data || data.orders || []);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || 1);
        setTotal(pg.total || 0);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [page, statusFilter, paymentFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, status) => {
    setUpdatingStatus(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status, note: `Status updated by admin to ${status}` });
      toast.success(`Order status updated to ${status}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      if (selectedOrder?._id === orderId) setSelectedOrder(prev => ({ ...prev, status }));
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingStatus(null); }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    await updateStatus(orderId, 'cancelled');
  };

  const openDetail = async (order) => {
    try {
      const { data } = await api.get(`/orders/${order._id}`);
      setSelectedOrder(data.order || data.data?.order || order);
    } catch { setSelectedOrder(order); }
    setDetailOpen(true);
  };

  const exportCSV = () => {
    const rows = [['Order#','Customer','Status','Payment','Total','Date'], ...orders.map(o => [o.orderNumber, o.user?.name || '', o.status, o.paymentMethod, o.totalPrice, new Date(o.createdAt).toLocaleDateString()])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`; a.download = 'orders.csv'; a.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} total orders</p>
        </div>
        <button onClick={exportCSV} className="btn-outline text-sm py-2 px-4 flex items-center gap-2 rounded-xl">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[150px]">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[150px]">
          <option value="">All Payments</option>
          <option value="pending">Payment Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        {(statusFilter || paymentFilter) && (
          <button onClick={() => { setStatusFilter(''); setPaymentFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl text-red-500 flex items-center gap-1">
            <Filter size={13} /> Clear
          </button>
        )}
      </GlassCard>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSkeleton variant="table" count={8} /> : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/70 dark:bg-slate-800/40">
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500">
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Order</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Customer</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Items</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Payment</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Date</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Total</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.length > 0 ? orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-brand-600 dark:text-brand-400">#{o.orderNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900 dark:text-white">{o.user?.name || '—'}</p>
                      <p className="text-xs text-slate-400">{o.user?.email || ''}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{o.items?.length || 0} items</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={o.status} />
                        <div className="relative group">
                          <button className="p-1 rounded text-slate-400 hover:text-slate-600" title="Change status">
                            <ChevronDown size={14} />
                          </button>
                          <div className="absolute left-0 top-full mt-1 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-10 min-w-[160px] hidden group-hover:block overflow-hidden">
                            {ORDER_STATUSES.filter(s => s !== o.status).map(s => (
                              <button key={s} onClick={() => updateStatus(o._id, s)} disabled={updatingStatus === o._id} className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-brand-50 dark:hover:bg-brand-900/20 hover:text-brand-600 capitalize transition-colors">
                                {s.replace(/_/g, ' ')}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 capitalize">
                      <span className={`text-xs font-semibold ${o.paymentStatus === 'paid' ? 'text-emerald-600' : o.paymentStatus === 'failed' ? 'text-red-500' : 'text-yellow-600'}`}>
                        {o.paymentStatus || 'pending'} · {o.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">₹{o.totalPrice?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openDetail(o)} className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors" title="View">
                          <Eye size={15} />
                        </button>
                        {!['cancelled','delivered','returned','refunded'].includes(o.status) && (
                          <button onClick={() => cancelOrder(o._id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors" title="Cancel">
                            <XCircle size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="px-5 py-16 text-center text-slate-400">No orders found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      {/* Order Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={`Order #${selectedOrder?.orderNumber}`} size="xl">
        {selectedOrder && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <StatusBadge status={selectedOrder.status} />
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Payment</p>
                <p className="font-semibold text-slate-900 dark:text-white capitalize">{selectedOrder.paymentMethod} · {selectedOrder.paymentStatus}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
                <p className="font-bold text-xl text-brand-600">₹{selectedOrder.totalPrice?.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Shipping Address</p>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-sm">
                <p className="font-semibold">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-slate-500">{selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                <p className="text-slate-500">{selectedOrder.shippingAddress?.phone}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Items ({selectedOrder.items?.length})</p>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                      <img src={item.image || 'https://placehold.co/48/f1f5f9/334155?text=P'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} · SKU: {item.sku}</p>
                    </div>
                    <p className="font-bold text-sm">₹{((item.price - item.price * item.discount / 100) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.filter(s => s !== selectedOrder.status).map(s => (
                  <button key={s} onClick={() => updateStatus(selectedOrder._id, s)} disabled={updatingStatus === selectedOrder._id} className="btn-outline text-xs py-1.5 px-3 capitalize rounded-lg">
                    → {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default AdminOrders;
