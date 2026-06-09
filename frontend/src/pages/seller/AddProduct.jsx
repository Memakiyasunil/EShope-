import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', sku: '', description: '', category: '', subCategory: '', brand: '', price: '', discount: 0, quantity: '', weight: 0, deliveryCharge: 0, tax: 5 });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/products', { ...form, price: Number(form.price), quantity: Number(form.quantity), discount: Number(form.discount) });
      toast.success('Product created');
      navigate('/dashboard/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const selectedCat = categories.find((c) => c._id === form.category);

  return (
    <div>
      <h1 className="section-title mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="glass-card max-w-2xl grid sm:grid-cols-2 gap-4">
        {['name', 'sku', 'brand', 'price', 'quantity', 'discount', 'weight', 'deliveryCharge', 'tax'].map((f) => (
          <div key={f}><label className="text-sm font-medium capitalize">{f}</label>
            <input className="input-field mt-1" type={['price','quantity','discount','weight','deliveryCharge','tax'].includes(f) ? 'number' : 'text'} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={['name','sku','price','quantity'].includes(f)} />
          </div>
        ))}
        <div className="sm:col-span-2"><label className="text-sm font-medium">Description</label>
          <textarea className="input-field mt-1" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>
        <div><label className="text-sm font-medium">Category</label>
          <select className="input-field mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: '' })} required>
            <option value="">Select</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div><label className="text-sm font-medium">Sub Category</label>
          <select className="input-field mt-1" value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })}>
            <option value="">Select</option>
            {selectedCat?.subCategories?.map((s) => <option key={s._id || s.name} value={s.name}>{s.name}</option>)}
          </select>
        </div>
        <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">{loading ? 'Creating...' : 'Create Product'}</button>
      </form>
    </div>
  );
};

export default AddProduct;
