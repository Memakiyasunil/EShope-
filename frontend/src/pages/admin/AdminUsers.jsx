import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, UserCheck, UserX, Filter, Download, Mail, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';

const emptyForm = { name: '', email: '', password: '', role: 'buyer', phone: '' };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    api.get(`/users?${params}`)
      .then(({ data }) => {
        setUsers(data.users || data.data || []);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || data.totalPages || 1);
        setTotal(pg.total || data.total || 0);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => { setEditUser(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '' }); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) {
        const payload = { name: form.name, role: form.role, phone: form.phone };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editUser._id}/status`, payload);
        toast.success('User updated');
      } else {
        await api.post('/admin/create-admin', form);
        toast.success('User created');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/users/${id}/status`, { isActive: !isActive });
      toast.success(isActive ? 'User deactivated' : 'User activated');
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !isActive } : u));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this user permanently?')) return;
    setDeleting(id);
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deactivated');
      fetchUsers();
    } catch { toast.error('Failed'); }
    finally { setDeleting(null); }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Email', 'Role', 'Status', 'Joined'], ...users.map(u => [u.name, u.email, u.role, u.isActive ? 'Active' : 'Inactive', new Date(u.createdAt).toLocaleDateString()])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`; a.download = 'users.csv'; a.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} total users</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-outline text-sm py-2 px-4 flex items-center gap-2 rounded-xl">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 rounded-xl">
            <Plus size={15} /> Add Admin User
          </button>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[130px]">
          <option value="">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field text-sm min-w-[130px]">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(search || roleFilter || statusFilter) && (
          <button onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl flex items-center gap-1 text-red-500">
            <Filter size={13} /> Clear
          </button>
        )}
      </GlassCard>

      {/* Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? <LoadingSkeleton variant="table" count={8} /> : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50/70 dark:bg-slate-800/40 text-slate-500">
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">User</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Email</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Role</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Email Verified</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Joined</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.length > 0 ? users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden shadow-sm">
                          {u.avatar?.url ? <img src={u.avatar.url} alt={u.name} className="w-full h-full object-cover" /> : u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : u.role === 'seller' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={u.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold ${u.isEmailVerified ? 'text-emerald-600' : 'text-red-500'}`}>
                        {u.isEmailVerified ? '✓ Verified' : '✗ Unverified'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20 transition-colors" title="Edit">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => toggleActive(u._id, u.isActive)} className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-slate-500 hover:bg-red-50 hover:text-red-500' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`} title={u.isActive ? 'Deactivate' : 'Activate'}>
                          {u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                        <button onClick={() => handleDelete(u._id)} disabled={deleting === u._id} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7} className="px-5 py-16 text-center text-slate-400">No users found</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editUser ? 'Edit User' : 'Create Admin User'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Full Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field w-full" placeholder="John Doe" />
          </div>
          {!editUser && (
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Email</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field w-full" placeholder="admin@example.com" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">{editUser ? 'New Password (leave blank to keep)' : 'Password'}</label>
            <input required={!editUser} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field w-full" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-field w-full" placeholder="+91 9999999999" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-5">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary py-2 px-6">{saving ? 'Saving...' : editUser ? 'Update User' : 'Create User'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminUsers;
