import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Trash2, Filter, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  const fetchReviews = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (statusFilter) params.set('status', statusFilter);
    if (ratingFilter) params.set('rating', ratingFilter);
    api.get(`/reviews?${params}`)
      .then(({ data }) => {
        setReviews(data.reviews || data.data || []);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || 1);
        setTotal(pg.total || 0);
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [page, statusFilter, ratingFilter]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      toast.success(`Review ${status}`);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, status } : r));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch { toast.error('Failed'); }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} className={i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'} />
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Reviews & Ratings</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} total reviews</p>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[150px]">
          <option value="">All Status</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={ratingFilter} onChange={e => { setRatingFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[130px]">
          <option value="">All Ratings</option>
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
        </select>
        {(statusFilter || ratingFilter) && (
          <button onClick={() => { setStatusFilter(''); setRatingFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl text-red-500 flex items-center gap-1">
            <Filter size={13} /> Clear
          </button>
        )}
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        {loading ? <LoadingSkeleton variant="table" count={8} /> : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {reviews.length > 0 ? reviews.map(r => (
              <div key={r._id} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {r.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{r.user?.name || 'Unknown User'}</p>
                        <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                      {renderStars(r.rating)}
                      <StatusBadge status={r.status || 'pending'} />
                    </div>
                    <p className="font-medium text-sm text-slate-700 dark:text-slate-300 mb-1">{r.title || 'No title'}</p>
                    <p className="text-sm text-slate-500 line-clamp-3">{r.review || r.comment}</p>
                    {r.product && (
                      <p className="text-xs text-brand-600 dark:text-brand-400 mt-2 font-medium">
                        Product: {typeof r.product === 'object' ? r.product.name : r.product}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {r.status !== 'approved' && (
                      <button onClick={() => updateStatus(r._id, 'approved')} className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Approve">
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button onClick={() => updateStatus(r._id, 'rejected')} className="p-2 rounded-xl text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors" title="Reject">
                        <XCircle size={18} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(r._id)} className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-16 text-center text-slate-400">No reviews found</div>
            )}
          </div>
        )}
      </GlassCard>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </motion.div>
  );
};

export default AdminReviews;
