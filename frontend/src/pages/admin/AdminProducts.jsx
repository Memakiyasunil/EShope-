import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import GlassCard from '../../components/ui/GlassCard';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    api.get(`/products?status=all&page=${page}&limit=15`)
      .then(({ data }) => {
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (Array.isArray(data.data) ? data.data : []));
        setProducts(productsArray);
        setTotalPages(data.totalPages || data.pagination?.pages || data.pagination?.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/products/${id}`, { isActive: !isActive });
      toast.success(isActive ? 'Product disabled' : 'Product enabled');
      setProducts((prev) => prev.map((p) => p._id === id ? { ...p, isActive: !isActive } : p));
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <LoadingSkeleton variant="table" count={8} />;

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Product Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage platform inventory and visibility</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-white/50 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30">
              <tr className="border-b border-slate-200/50 dark:border-slate-800/50 text-slate-500">
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Visibility</th>
                <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm">
                        <img src={p.images?.[0] || 'https://placehold.co/100x100/f8fafc/334155?text=Img'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">₹{p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">{p.quantity}</td>
                    <td className="px-6 py-4"><StatusBadge status={p.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => toggleActive(p._id, p.isActive)} className="btn-outline text-[10px] uppercase tracking-widest py-1.5 px-3 rounded-lg shadow-sm hover:shadow-md transition-all">
                        {p.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500 font-medium">No products found</td>
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

export default AdminProducts;
