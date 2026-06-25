import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [processing, setProcessing] = useState(null);

  const fetchWithdrawals = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/withdrawals/admin?${params}`)
      .then(({ data }) => {
        setWithdrawals(data.withdrawals || data.data || []);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || 1);
        setTotal(pg.total || 0);
      })
      .catch(() => setWithdrawals([]))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

  const updateStatus = async (id, status) => {
    let note = '';
    if (status === 'rejected') {
      note = window.prompt('Enter reason for rejection:');
      if (note === null) return;
    } else {
      if (!window.confirm('Approve this withdrawal?')) return;
    }
    
    setProcessing(id);
    try {
      await api.put(`/withdrawals/admin/${id}/status`, { status, adminNote: note });
      toast.success(`Withdrawal ${status}`);
      setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status, adminNote: note } : w));
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Withdrawal Requests</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} total requests</p>
        </div>
      </div>

      <GlassCard className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search by seller name..." className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[140px]">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
        {statusFilter && (
          <button onClick={() => { setStatusFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl text-red-500 flex items-center gap-1">
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
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Seller</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Amount</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Bank Details</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Date</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {withdrawals.length > 0 ? withdrawals.map(w => (
                  <tr key={w._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{w.seller?.shopName || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{w.seller?.user?.email || ''}</p>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-brand-600">₹{w.amount?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      {w.bankDetails ? (
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                          <p>{w.bankDetails.bankName}</p>
                          <p>A/C: {w.bankDetails.accountNumber}</p>
                          <p>IFSC: {w.bankDetails.ifscCode}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400">No bank info</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={w.status} />
                      {w.adminNote && <p className="text-[10px] text-slate-400 mt-1 max-w-[120px] truncate" title={w.adminNote}>Note: {w.adminNote}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {w.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(w._id, 'completed')} disabled={processing === w._id} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Approve">
                              <CheckCircle size={18} />
                            </button>
                            <button onClick={() => updateStatus(w._id, 'rejected')} disabled={processing === w._id} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors" title="Reject">
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="px-5 py-16 text-center text-slate-400">No withdrawal requests found</td></tr>
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

export default AdminWithdrawals;
