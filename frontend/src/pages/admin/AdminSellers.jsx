import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, PauseCircle, PlayCircle, Package, TrendingUp, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchSellers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    api.get(`/sellers?${params}`)
      .then(({ data }) => {
        setSellers(data.sellers || data.data?.sellers || data.data || []);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || data.totalPages || 1);
        setTotal(pg.total || data.total || 0);
      })
      .catch(() => setSellers([]))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const updateStatus = async (id, status) => {
    try {
      // The backend uses specific endpoints for each status action
      let endpoint = '';
      if (status === 'approved') endpoint = `/sellers/${id}/approve`;
      else if (status === 'rejected') endpoint = `/sellers/${id}/reject`;
      else if (status === 'suspended') endpoint = `/sellers/${id}/suspend`;
      else endpoint = `/sellers/${id}/status`; // Fallback if any other

      await api.put(endpoint, { status });
      toast.success(`Seller ${status}`);
      setSellers(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch { toast.error('Failed to update status'); }
  };

  const statusCounts = sellers.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Seller Management</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} total sellers</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: statusCounts.pending || 0, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/10' },
          { label: 'Approved', count: statusCounts.approved || 0, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Suspended', count: statusCounts.suspended || 0, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/10' },
          { label: 'Rejected', count: statusCounts.rejected || 0, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' },
        ].map(s => (
          <GlassCard key={s.label} className={`p-4 ${s.bg}`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.count}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">{s.label} Sellers</p>
          </GlassCard>
        ))}
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by shop name or email..." className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[140px]">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
          <option value="rejected">Rejected</option>
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl text-red-500 flex items-center gap-1">
            <Filter size={13} /> Clear
          </button>
        )}
      </GlassCard>

      {/* Seller Cards Grid */}
      {loading ? <LoadingSkeleton variant="card" count={6} /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sellers.map(s => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card overflow-hidden group"
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
                  {s.logo ? <img src={s.logo} alt={s.shopName} className="w-full h-full object-cover" /> : s.shopName?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate">{s.shopName}</h3>
                  <p className="text-xs text-slate-500 truncate">{s.email}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{s.totalProducts || 0}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Products</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">₹{(s.walletBalance || 0).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 font-medium">Wallet</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-center">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{s.rating?.toFixed(1) || '0.0'}★</p>
                  <p className="text-[10px] text-slate-500 font-medium">Rating</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                {s.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(s._id, 'approved')} className="flex-1 btn-primary text-xs py-1.5 flex items-center justify-center gap-1">
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button onClick={() => updateStatus(s._id, 'rejected')} className="flex-1 btn-outline text-xs py-1.5 text-red-500 flex items-center justify-center gap-1">
                      <XCircle size={13} /> Reject
                    </button>
                  </>
                )}
                {s.status === 'approved' && (
                  <button onClick={() => updateStatus(s._id, 'suspended')} className="flex-1 btn-outline text-xs py-1.5 flex items-center justify-center gap-1 text-orange-600">
                    <PauseCircle size={13} /> Suspend
                  </button>
                )}
                {(s.status === 'suspended' || s.status === 'rejected') && (
                  <button onClick={() => updateStatus(s._id, 'approved')} className="flex-1 btn-primary text-xs py-1.5 flex items-center justify-center gap-1">
                    <PlayCircle size={13} /> Activate
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {sellers.length === 0 && (
            <div className="col-span-3 glass-card text-center py-16 text-slate-400">No sellers found</div>
          )}
        </div>
      )}

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </motion.div>
  );
};

export default AdminSellers;
