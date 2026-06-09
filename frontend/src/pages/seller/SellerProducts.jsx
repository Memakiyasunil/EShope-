import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    api.get('/products/seller/my-products')
      .then(({ data }) => {
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (Array.isArray(data.data) ? data.data : []));
        setProducts(productsArray);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSkeleton variant="table" count={5} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">My Products</h1>
        <Link to="/dashboard/seller/products/add" className="btn-primary text-sm"><Plus size={16} /> Add Product</Link>
      </div>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-slate-200 dark:border-slate-700">
            <th className="text-left p-3">Product</th><th className="text-left p-3">Price</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th>
          </tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium">{p.name}</span>
                </td>
                <td className="p-3">₹{p.price?.toLocaleString()}</td>
                <td className="p-3">{p.quantity}</td>
                <td className="p-3"><StatusBadge status={p.stock} /></td>
                <td className="p-3 text-right">
                  <Link to={`/dashboard/seller/products/edit/${p._id}`} className="inline-flex p-1.5 text-brand-600"><Edit size={16} /></Link>
                  <button onClick={() => handleDelete(p._id)} className="inline-flex p-1.5 text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length && <p className="text-center py-8 text-slate-500">No products yet</p>}
      </div>
    </div>
  );
};

export default SellerProducts;
