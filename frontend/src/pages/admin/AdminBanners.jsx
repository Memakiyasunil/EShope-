import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Image as ImageIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';

const emptyForm = { title: '', subtitle: '', link: '', buttonText: '', position: 'home_hero', startDate: '', endDate: '', isActive: true };

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBanner, setEditBanner] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const fetchBanners = () => {
    api.get('/banners').then(({ data }) => setBanners(data.banners || data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBanners(); }, []);

  const openCreate = () => { setEditBanner(null); setForm(emptyForm); setImageFile(null); setImagePreview(null); setModalOpen(true); };
  const openEdit = (b) => {
    setEditBanner(b);
    setForm({ title: b.title || '', subtitle: b.subtitle || '', link: b.link || '', buttonText: b.buttonText || '', position: b.position || 'home_hero', startDate: b.startDate?.slice(0, 10) || '', endDate: b.endDate?.slice(0, 10) || '', isActive: b.isActive });
    setImagePreview(b.image || null);
    setImageFile(null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be less than 5MB');
    setImageFile(file);
    const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result); reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      if (editBanner) {
        await api.put(`/banners/${editBanner._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner updated');
      } else {
        await api.post('/banners', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Banner created');
      }
      setModalOpen(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try { await api.delete(`/banners/${id}`); toast.success('Banner deleted'); fetchBanners(); }
    catch { toast.error('Failed'); }
  };

  const toggleActive = async (b) => {
    try {
      await api.put(`/banners/${b._id}`, { isActive: !b.isActive });
      toast.success(`Banner ${!b.isActive ? 'activated' : 'deactivated'}`);
      setBanners(prev => prev.map(x => x._id === b._id ? { ...x, isActive: !x.isActive } : x));
    } catch { toast.error('Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Banner Management</h1>
          <p className="text-slate-500 mt-1">{banners.length} banners configured</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 rounded-xl">
          <Plus size={15} /> Create Banner
        </button>
      </div>

      {loading ? <LoadingSkeleton variant="card" count={4} /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map(b => (
            <motion.div key={b._id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass-card overflow-hidden group p-0">
              <div className="relative h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400">
                    <ImageIcon size={40} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openEdit(b)} className="bg-white text-slate-900 p-2 rounded-xl hover:bg-brand-50 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(b._id)} className="bg-white text-red-500 p-2 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                </div>
                <div className="absolute top-3 right-3">
                  <button onClick={() => toggleActive(b)} className={`px-3 py-1 rounded-full text-xs font-bold ${b.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}>
                    {b.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 dark:text-white">{b.title || 'Untitled Banner'}</h3>
                {b.subtitle && <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{b.subtitle}</p>}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full font-medium capitalize">{b.position?.replace(/_/g, ' ')}</span>
                  {b.link && (
                    <a href={b.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-600 transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                {(b.startDate || b.endDate) && (
                  <p className="text-xs text-slate-400 mt-2">
                    {b.startDate && new Date(b.startDate).toLocaleDateString()} {b.endDate && `→ ${new Date(b.endDate).toLocaleDateString()}`}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
          {banners.length === 0 && (
            <div className="col-span-3 glass-card text-center py-16 text-slate-400">
              <ImageIcon size={48} className="mx-auto mb-3 opacity-30" />
              <p>No banners created yet. Click "Create Banner" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editBanner ? 'Edit Banner' : 'Create Banner'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">Banner Image</label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl h-36 flex items-center justify-center cursor-pointer hover:border-brand-400 transition-colors overflow-hidden relative">
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon size={32} className="mx-auto mb-2" />
                  <p className="text-sm">Click to upload (max 5MB)</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field w-full" placeholder="Big Sale!" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Subtitle</label>
              <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="input-field w-full" placeholder="Up to 50% off" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Link URL</label>
              <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} className="input-field w-full" placeholder="/categories/electronics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Button Text</label>
              <input value={form.buttonText} onChange={e => setForm({ ...form, buttonText: e.target.value })} className="input-field w-full" placeholder="Shop Now" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Position</label>
              <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="input-field w-full">
                <option value="home_hero">Home Hero</option>
                <option value="home_middle">Home Middle</option>
                <option value="sidebar">Sidebar</option>
                <option value="category">Category Page</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">End Date</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="input-field w-full" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="bannerActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-brand-600" />
              <label htmlFor="bannerActive" className="text-sm font-medium">Active Banner</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-5">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary py-2 px-6">{saving ? 'Saving...' : editBanner ? 'Update Banner' : 'Create Banner'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminBanners;
