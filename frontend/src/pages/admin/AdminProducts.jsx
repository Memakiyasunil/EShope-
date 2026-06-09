import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get(`/products?page=${page}&limit=15`)
      .then(({ data }) => {
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (Array.isArray(data.data) ? data.data : []));
        setProducts(productsArray);
        setTotalPages(data.totalPages || data.pagination?.pages || data.pagination?.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page]);

  const toggleActive = async (id, isActive) => {
    try {
      await api.put(`/products/${id}`, { isActive: !isActive });
      toast.success('Updated');
      setProducts((prev) => prev.map((p) => p._id === id ? { ...p, isActive: !isActive } : p));
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSkeleton variant="table" count={8} />;

  return (
    <div>
      <h1 className="section-title mb-6">Product Management</h1>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left p-3">Product</th><th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Active</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-3 flex items-center gap-2"><img src={p.images?.[0]} alt="" className="w-8 h-8 rounded object-cover" />{p.name}</td>
                <td className="p-3">₹{p.price?.toLocaleString()}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3">{p.isActive ? 'Yes' : 'No'}</td>
                <td className="p-3 text-right">
                  <button onClick={() => toggleActive(p._id, p.isActive)} className="btn-outline text-xs py-1 px-2">{p.isActive ? 'Disable' : 'Enable'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default AdminProducts;
