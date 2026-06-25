import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Edit2, Trash2, ToggleLeft, ToggleRight, Plus, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 15 });
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    if (statusFilter) params.set('isActive', statusFilter);
    api.get(`/products?${params}`)
      .then(({ data }) => {
        const arr = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (Array.isArray(data.data) ? data.data : []));
        setProducts(arr);
        const pg = data.pagination || {};
        setTotalPages(pg.pages || pg.totalPages || data.totalPages || 1);
        setTotal(pg.total || data.total || arr.length);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, search, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchProducts();
    api.get('/categories').then(({ data }) => setCategories(data.categories || data.data || [])).catch(() => {});
  }, [fetchProducts]);

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/products/${id}`, { isActive: !isActive });
      toast.success(isActive ? 'Product disabled' : 'Product enabled');
      setProducts(prev => prev.map(p => p._id === id ? { ...p, isActive: !isActive } : p));
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Product Management</h1>
          <p className="text-slate-500 mt-1">{total.toLocaleString()} total products</p>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products, SKU..." className="input-field pl-9 w-full text-sm" />
        </div>
        <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[160px]">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm min-w-[130px]">
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Disabled</option>
        </select>
        {(search || categoryFilter || statusFilter) && (
          <button onClick={() => { setSearch(''); setCategoryFilter(''); setStatusFilter(''); setPage(1); }} className="btn-outline text-xs px-3 py-2 rounded-xl text-red-500 flex items-center gap-1">
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
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Product</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">SKU</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Category</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Price</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Stock</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Rating</th>
                  <th className="text-left px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="text-right px-5 py-3.5 font-bold text-[10px] uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {products.length > 0 ? products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 shadow-sm">
                          <img src={p.images?.[0] || 'https://placehold.co/44/f1f5f9/334155?text=P'} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white max-w-[200px] truncate">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.brand || 'No brand'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{p.sku}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs">{typeof p.category === 'object' ? p.category?.name : '—'}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">₹{p.price?.toLocaleString()}</p>
                      {p.discount > 0 && <p className="text-xs text-emerald-600 font-medium">{p.discount}% off</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold text-sm ${p.quantity === 0 ? 'text-red-500' : p.quantity <= 10 ? 'text-orange-500' : 'text-emerald-600'}`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-yellow-600 font-semibold text-sm">★ {p.rating?.toFixed(1) || '0.0'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => toggleActive(p._id, p.isActive)} className={`p-1.5 rounded-lg transition-colors ${p.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title={p.isActive ? 'Disable' : 'Enable'}>
                          {p.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={8} className="px-5 py-16 text-center text-slate-400">No products found</td></tr>
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

export default AdminProducts;
