import { useEffect, useState, useCallback } from 'react';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';

const AdminTransactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = useCallback(() => {
    setLoading(true);
    api.get(`/payments?page=${page}&limit=15`)
      .then(({ data }) => {
        setPayments(data.data || []);
        setTotalPages(data.pagination?.pages || 1);
      })
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  if (loading) return <LoadingSkeleton variant="table" count={8} />;

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Platform payment history and status</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-white/50 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30">
              <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-slate-500">
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Transaction ID</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Order</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">User</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 text-[11px] font-mono text-slate-500 dark:text-slate-400">{p.transactionId || p._id}</td>
                    <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400">#{p.order?.orderNumber || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{p.user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 uppercase text-[10px] font-bold tracking-wider">{p.method}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">₹{p.amount?.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500 font-medium">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
      
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
};

export default AdminTransactions;
