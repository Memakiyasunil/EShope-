import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import api from '../../utils/axios';
import toast from 'react-hot-toast';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';
import StatsCard from '../../components/common/StatsCard';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [summary, setSummary] = useState(null);

  const fetchPayments = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (statusFilter) params.set('status', statusFilter);
    if (methodFilter) params.set('method', methodFilter);
    api.get(`/payments/all?${params}`)
      .then(({ data }) => {
        setPayments(data.payments || data.data?.payments || data.data || []);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || 1);
        setTotal(pg.total || 0);
        if (data.summary) setSummary(data.summary);
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [page, statusFilter, methodFilter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const initiateRefund = async (paymentId) => {
    if (!window.confirm('Initiate refund for this payment?')) return;
    try {
      await api.post(`/payments/${paymentId}/refund`);
      toast.success('Refund initiated');
      fetchPayments();
    } catch { toast.error('Refund failed'); }
  };

  const exportCSV = () => {
    const rows = [['Order#','User','Amount','Method','Status','Date'], ...payments.map(p => [p.order?.orderNumber || '', p.user?.name || '', p.amount, p.method, p.status, new Date(p.createdAt).toLocaleDateString()])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`; a.download = 'payments.csv'; a.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Payment Management</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} transactions</p>
        </div>
        <button onClick={exportCSV} className="btn-outline text-sm py-2 px-4 flex items-center gap-2 rounded-xl">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[150px]">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select value={methodFilter} onChange={e => { setMethodFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[150px]">
          <option value="">All Methods</option>
          <option value="razorpay">Razorpay</option>
          <option value="stripe">Stripe</option>
          <option value="cod">Cash on Delivery</option>
        </select>
        {(statusFilter || methodFilter) && (
          <button onClick={() => { setStatusFilter(''); setMethodFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl text-red-500 flex items-center gap-1">
            <Filter size={13} /> Clear
          </button>
        )}
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSkeleton variant="table" count={8} /> : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/70 dark:bg-slate-800/40">
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500">
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Transaction ID</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Order</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Customer</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Method</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Date</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Amount</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.length > 0 ? payments.map(p => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500 max-w-[140px] truncate">{p.transactionId || p._id}</td>
                    <td className="px-5 py-3.5 font-bold text-brand-600 dark:text-brand-400">
                      {p.order?.orderNumber ? `#${p.order.orderNumber}` : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{p.user?.name || '—'}</p>
                      <p className="text-xs text-slate-400">{p.user?.email || ''}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">{p.method || p.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-slate-900 dark:text-white">₹{p.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-right">
                      {p.status === 'completed' && (
                        <button onClick={() => initiateRefund(p._id)} className="text-xs btn-outline py-1 px-3 rounded-lg text-orange-600 hover:border-orange-300 flex items-center gap-1 ml-auto">
                          <RefreshCw size={12} /> Refund
                        </button>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="px-5 py-16 text-center text-slate-400">No payments found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </motion.div>
  );
};

export default AdminPayments;
