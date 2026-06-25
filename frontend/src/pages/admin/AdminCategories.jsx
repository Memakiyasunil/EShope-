import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';

const emptyForm = { name: '', description: '', parent: '' };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});

  const fetchCategories = () => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = (parentId = '') => { setEditCat(null); setForm({ ...emptyForm, parent: parentId }); setModalOpen(true); };
  const openEdit = (c) => { setEditCat(c); setForm({ name: c.name, description: c.description || '', parent: c.parent || '' }); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCat) {
        await api.put(`/categories/${editCat._id}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/categories', form);
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch { toast.error('Failed to delete'); }
  };

  // Build tree
  const roots = categories.filter(c => !c.parent);
  const children = (parentId) => categories.filter(c => c.parent?.toString() === parentId?.toString());

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Category Management</h1>
          <p className="text-slate-500 mt-1">{categories.length} categories total</p>
        </div>
        <button onClick={() => openCreate()} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 rounded-xl">
          <Plus size={15} /> Add Category
        </button>
      </div>

      {/* Category Tree */}
      {loading ? <LoadingSkeleton variant="list" count={5} /> : (
        <GlassCard className="p-0 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {roots.length === 0 && (
            <div className="p-16 text-center text-slate-400">No categories yet. Create one to get started.</div>
          )}
          {roots.map((cat) => {
            const childCats = children(cat._id);
            const isExpanded = expanded[cat._id];
            return (
              <div key={cat._id}>
                {/* Parent */}
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                  <button onClick={() => setExpanded(p => ({ ...p, [cat._id]: !isExpanded }))} className="text-slate-400 hover:text-slate-600">
                    {childCats.length > 0 ? (isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />) : <Tag size={16} />}
                  </button>
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-purple-900/20 flex items-center justify-center shrink-0">
                    {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : <Tag size={18} className="text-brand-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">{cat.name}</p>
                    <p className="text-xs text-slate-500">{childCats.length} sub-categories · {cat.productCount || 0} products</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openCreate(cat._id)} className="text-xs btn-outline py-1 px-2 rounded-lg flex items-center gap-1" title="Add sub-category">
                      <Plus size={12} /> Sub
                    </button>
                    <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDelete(cat._id, cat.name)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Children */}
                {isExpanded && childCats.map(child => (
                  <div key={child._id} className="flex items-center gap-4 pl-14 pr-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      {child.image ? <img src={child.image} alt={child.name} className="w-full h-full object-cover" /> : <Tag size={14} className="text-slate-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{child.name}</p>
                      <p className="text-xs text-slate-400">{child.productCount || 0} products</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(child)} className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(child._id, child.name)} className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </GlassCard>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editCat ? 'Edit Category' : 'Add Category'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Category Name *</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field w-full" placeholder="e.g. Electronics" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field w-full h-24 resize-none" placeholder="Short description..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Parent Category (optional)</label>
            <select value={form.parent} onChange={e => setForm({ ...form, parent: e.target.value })} className="input-field w-full">
              <option value="">— None (Top Level) —</option>
              {categories.filter(c => !c.parent && c._id !== editCat?._id).map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-5">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary py-2 px-6">{saving ? 'Saving...' : editCat ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminCategories;
