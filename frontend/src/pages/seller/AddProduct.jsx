import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';

const AddProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({ 
    name: '', sku: '', description: '', category: '', subCategory: '', 
    brand: '', price: '', discount: 0, quantity: '', weight: 0, 
    deliveryCharge: 0, tax: 5 
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || data.data || []));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
    
    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      images.forEach(img => {
        formData.append('images', img);
      });

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Product created');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const selectedCat = categories.find((c) => c._id === form.category);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Basic Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {['name', 'sku', 'brand', 'price', 'quantity', 'discount'].map((f) => (
                <div key={f}>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize mb-1 block">{f}</label>
                  <input className="input-field w-full" type={['price','quantity','discount'].includes(f) ? 'number' : 'text'} value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={['name','sku','price','quantity'].includes(f)} />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Description</label>
                <textarea className="input-field w-full" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Product Images</h2>
            <div 
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload images</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB (Max 5)</p>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mt-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Organization</h2>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Category</label>
              <select className="input-field w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: '' })} required>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Sub Category</label>
              <select className="input-field w-full" value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })}>
                <option value="">Select Sub Category</option>
                {selectedCat?.subCategories?.map((s) => <option key={s._id || s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Shipping & Tax</h2>
            {['weight', 'deliveryCharge', 'tax'].map((f) => (
              <div key={f}>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize mb-1 block">{f}</label>
                <input className="input-field w-full" type="number" value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
              </div>
            ))}
          </GlassCard>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base shadow-lg shadow-brand-500/20">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
