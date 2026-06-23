import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    api.get(`/users?role=buyer&page=${page}&limit=15`)
      .then(({ data }) => {
        setCustomers(data.data || data.users || []);
        setTotalPages(data.pagination?.pages || data.totalPages || 1);
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/${id}/status`, { isActive: !isActive });
      toast.success('Customer status updated');
      fetchCustomers();
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <LoadingSkeleton variant="table" count={8} />;

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Customers Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">View and manage customer accounts</p>
        </div>
      </div>
      
      <GlassCard className="p-0 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-white/50 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30">
              <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-slate-500">
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{c.email}</td>
                    <td className="px-6 py-4"><StatusBadge status={c.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => toggleActive(c._id, c.isActive)} className="btn-outline text-[10px] uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                        {c.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500 font-medium">No customers found</td>
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

export default AdminCustomers;
