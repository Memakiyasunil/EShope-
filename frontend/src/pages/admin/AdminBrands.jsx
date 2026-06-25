import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

// Brands are stored in local state (localStorage persistence) since no separate backend model exists
const STORAGE_KEY = 'admin_brands';

const loadBrands = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
};
const saveBrands = (brands) => localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));

const emptyForm = { name: '', description: '', website: '' };

const AdminBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    setTimeout(() => { setBrands(loadBrands()); setLoading(false); }, 300);
  }, []);

  const openCreate = () => { setEditBrand(null); setForm(emptyForm); setLogoFile(null); setLogoPreview(null); setModalOpen(true); };
  const openEdit = (b) => { setEditBrand(b); setForm({ name: b.name, description: b.description || '', website: b.website || '' }); setLogoPreview(b.logo || null); setLogoFile(null); setModalOpen(true); };

  const handleLogoChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setLogoFile(file);
    const reader = new FileReader(); reader.onloadend = () => setLogoPreview(reader.result); reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const logo = logoPreview || (editBrand?.logo || null);
    if (editBrand) {
      const updated = brands.map(b => b.id === editBrand.id ? { ...b, ...form, logo } : b);
      saveBrands(updated); setBrands(updated);
      toast.success('Brand updated');
    } else {
      const newBrand = { id: Date.now().toString(), ...form, logo, createdAt: new Date().toISOString() };
      const updated = [newBrand, ...brands];
      saveBrands(updated); setBrands(updated);
      toast.success('Brand created');
    }
    setModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete brand "${name}"?`)) return;
    const updated = brands.filter(b => b.id !== id);
    saveBrands(updated); setBrands(updated);
    toast.success('Brand deleted');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Brand Management</h1>
          <p className="text-slate-500 mt-1">{brands.length} brands configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 rounded-xl">
          <Plus size={15} /> Add Brand
        </button>
      </div>

      {loading ? <LoadingSkeleton variant="card" count={6} /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {brands.map(b => (
            <GlassCard key={b.id} className="group overflow-hidden">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3 flex items-center justify-center">
                  {b.logo ? <img src={b.logo} alt={b.name} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-400" />}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{b.name}</h3>
                {b.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{b.description}</p>}
                {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 mt-1 hover:underline">{b.website}</a>}
              </div>
              <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <button onClick={() => openEdit(b)} className="flex-1 btn-outline text-xs py-1.5 flex items-center justify-center gap-1">
                  <Edit2 size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(b.id, b.name)} className="flex-1 btn-outline text-xs py-1.5 text-red-500 hover:border-red-300 flex items-center justify-center gap-1">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </GlassCard>
          ))}
          {brands.length === 0 && (
            <div className="col-span-4 glass-card text-center py-16 text-slate-400">
              <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
              <p>No brands added yet.</p>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editBrand ? 'Edit Brand' : 'Add Brand'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex justify-center">
            <label className="cursor-pointer">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-400 transition-colors flex items-center justify-center">
                {logoPreview ? <img src={logoPreview} alt="logo" className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-400" />}
              </div>
              <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <p className="text-center text-xs text-slate-400 mt-1">Click to upload logo</p>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Brand Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field w-full" placeholder="Samsung" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field w-full h-20 resize-none" placeholder="Short brand description..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Website</label>
            <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="input-field w-full" placeholder="https://samsung.com" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-5">Cancel</button>
            <button type="submit" className="btn-primary py-2 px-6">{editBrand ? 'Update Brand' : 'Create Brand'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminBrands;
