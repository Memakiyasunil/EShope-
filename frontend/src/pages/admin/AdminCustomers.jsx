import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Edit2, Trash2, UserCheck, UserX, Eye, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15, role: 'buyer' });
    if (search) params.set('search', search);
    api.get(`/users?${params}`)
      .then(({ data }) => {
        let list = data.users || data.data || [];
        if (statusFilter) list = list.filter(u => u.isActive === (statusFilter === 'active'));
        setCustomers(list);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || data.totalPages || 1);
        setTotal(pg.total || data.total || 0);
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/${id}/status`, { isActive: !isActive });
      toast.success(isActive ? 'Customer blocked' : 'Customer unblocked');
      setCustomers(prev => prev.map(u => u._id === id ? { ...u, isActive: !isActive } : u));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently remove this customer?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Customer removed');
      fetchCustomers();
    } catch { toast.error('Failed'); }
  };

  const openDetail = (c) => { setSelectedCustomer(c); setDetailOpen(true); };

  const exportCSV = () => {
    const rows = [['Name','Email','Phone','Status','Joined','Verified'], ...customers.map(c => [c.name, c.email, c.phone || '', c.isActive ? 'Active' : 'Blocked', new Date(c.createdAt).toLocaleDateString(), c.isEmailVerified ? 'Yes' : 'No'])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`; a.download = 'customers.csv'; a.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Customer Management</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} customers</p>
        </div>
        <button onClick={exportCSV} className="btn-outline text-sm py-2 px-4 flex items-center gap-2 rounded-xl">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <GlassCard className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[140px]">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Blocked</option>
        </select>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl text-red-500 flex items-center gap-1">
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
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Customer</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Contact</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Verified</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Addresses</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Joined</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.length > 0 ? customers.map(c => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                          {c.avatar?.url ? <img src={c.avatar.url} alt={c.name} className="w-full h-full object-cover" /> : c.name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-slate-600 dark:text-slate-400">{c.email}</p>
                      {c.phone && <p className="text-xs text-slate-400">{c.phone}</p>}
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold ${c.isEmailVerified ? 'text-emerald-600' : 'text-red-500'}`}>
                        {c.isEmailVerified ? '✓' : '✗'} Email
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{c.addresses?.length || 0} saved</td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openDetail(c)} className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors" title="View Details">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => toggleActive(c._id, c.isActive)} className={`p-1.5 rounded-lg transition-colors ${c.isActive ? 'text-slate-500 hover:bg-red-50 hover:text-red-500' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`} title={c.isActive ? 'Block' : 'Unblock'}>
                          {c.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-slate-400">No customers found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      {/* Customer Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={`Customer: ${selectedCustomer?.name}`} size="lg">
        {selectedCustomer && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {selectedCustomer.avatar?.url ? <img src={selectedCustomer.avatar.url} alt={selectedCustomer.name} className="w-full h-full object-cover" /> : selectedCustomer.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</h3>
                <p className="text-slate-500">{selectedCustomer.email}</p>
                {selectedCustomer.phone && <p className="text-slate-400 text-sm">{selectedCustomer.phone}</p>}
              </div>
              <div className="ml-auto">
                <StatusBadge status={selectedCustomer.isActive ? 'active' : 'inactive'} />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-brand-600">{selectedCustomer.addresses?.length || 0}</p>
                <p className="text-xs text-slate-500 mt-1">Saved Addresses</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-emerald-600">{selectedCustomer.isEmailVerified ? 'Yes' : 'No'}</p>
                <p className="text-xs text-slate-500 mt-1">Email Verified</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500 mt-1">Member Since</p>
              </div>
            </div>

            {selectedCustomer.addresses?.length > 0 && (
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Saved Addresses</p>
                <div className="space-y-2">
                  {selectedCustomer.addresses.map((a, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm">
                      <p className="font-semibold">{a.fullName} {a.isDefault && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded ml-1">Default</span>}</p>
                      <p className="text-slate-500">{a.addressLine1}, {a.city}, {a.state} {a.postalCode}</p>
                      <p className="text-slate-400">{a.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default AdminCustomers;
