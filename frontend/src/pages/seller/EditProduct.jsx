import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [form, setForm] = useState({ 
    name: '', sku: '', description: '', category: '', subCategory: '', 
    brand: '', price: '', discount: 0, quantity: '', weight: 0, 
    deliveryCharge: 0, tax: 5 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`)
        ]);
        
        setCategories(catsRes.data.categories || catsRes.data.data || []);
        
        const product = prodRes.data.product || prodRes.data.data;
        setForm({
          name: product.name || '',
          sku: product.sku || '',
          description: product.description || '',
          category: product.category?._id || product.category || '',
          subCategory: product.subCategory || '',
          brand: product.brand || '',
          price: product.price || '',
          discount: product.discount || 0,
          quantity: product.quantity || '',
          weight: product.weight || 0,
          deliveryCharge: product.deliveryCharge || 0,
          tax: product.tax || 5
        });
        
        if (product.images && product.images.length > 0) {
          setExistingImages(product.images);
        }
      } catch (err) {
        toast.error('Failed to load product details');
        navigate('/seller/products');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + existingImages.length + files.length > 10) {
      toast.error('Maximum 10 total images allowed');
      return;
    }
    setImages((prev) => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Note: Backend doesn't currently support deleting individual existing images cleanly via PUT
  // without a specific image-delete endpoint, so we will just allow appending new ones for now.
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      images.forEach(img => {
        formData.append('images', img);
      });

      await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Product updated successfully');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCat = categories.find((c) => c._id === form.category);

  if (loading) return <LoadingSkeleton variant="card" count={3} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Product</h1>
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
            
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Existing Images</p>
                <div className="grid grid-cols-5 gap-4">
                  {existingImages.map((src, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                      <img src={src} alt="Existing Preview" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div 
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload new images</p>
              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
              <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-5 gap-4 mt-4">
                {previews.map((src, index) => (
                  <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group border-brand-500">
                    <img src={src} alt="New Preview" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-brand-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">New</span>
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

          <button type="submit" disabled={submitting} className="btn-primary w-full py-3 text-base shadow-lg shadow-brand-500/20">
            {submitting ? 'Saving Changes...' : 'Save Product Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
