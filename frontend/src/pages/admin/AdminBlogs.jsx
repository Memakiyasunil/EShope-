import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';
import Modal from '../../components/common/Modal';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', author: '', slug: '', tags: '' });
  const [saving, setSaving] = useState(false);
  
  // Simulated since there's no backend blog routes yet
  useEffect(() => {
    setTimeout(() => {
      setBlogs([
        { _id: '1', title: 'Top 10 Gadgets of 2026', content: 'Here are the best gadgets...', author: 'Admin', slug: 'top-10-gadgets-2026', tags: 'tech,gadgets', createdAt: new Date().toISOString() },
        { _id: '2', title: 'How to start selling', content: 'Step by step guide...', author: 'Admin', slug: 'how-to-sell', tags: 'sellers,guide', createdAt: new Date().toISOString() },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      if (editBlog) {
        setBlogs(prev => prev.map(b => b._id === editBlog._id ? { ...b, ...form } : b));
        toast.success('Blog updated');
      } else {
        setBlogs([{ _id: Date.now().toString(), ...form, createdAt: new Date().toISOString() }, ...blogs]);
        toast.success('Blog created');
      }
      setSaving(false);
      setModalOpen(false);
    }, 400);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete blog post?')) return;
    setBlogs(prev => prev.filter(b => b._id !== id));
    toast.success('Blog deleted');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Blog Management</h1>
          <p className="text-slate-500 mt-1">Manage articles and guides (Mock UI)</p>
        </div>
        <button onClick={() => { setEditBlog(null); setForm({ title: '', content: '', author: 'Admin', slug: '', tags: '' }); setModalOpen(true); }} className="btn-primary text-sm py-2 px-5 flex items-center gap-2 rounded-xl">
          <Plus size={15} /> Write Post
        </button>
      </div>

      {loading ? <LoadingSkeleton variant="card" count={3} /> : (
        <div className="grid lg:grid-cols-3 gap-6">
          {blogs.map(b => (
            <GlassCard key={b._id} className="p-0 overflow-hidden flex flex-col">
              <div className="h-40 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 relative group">
                <ImageIcon size={32} />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => { setEditBlog(b); setForm({ title: b.title, content: b.content, author: b.author, slug: b.slug, tags: b.tags }); setModalOpen(true); }} className="p-2 bg-white rounded-lg text-slate-900 hover:text-brand-600"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(b._id)} className="p-2 bg-white rounded-lg text-red-500"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{b.content}</p>
                <div className="mt-auto flex justify-between items-center text-xs text-slate-400">
                  <span>{b.author} • {new Date(b.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><LinkIcon size={12}/> /{b.slug}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editBlog ? 'Edit Post' : 'New Post'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Title</label>
            <input required value={form.title} onChange={e => {
              setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') })
            }} className="input-field w-full" placeholder="Post Title" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Slug</label>
            <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="input-field w-full" placeholder="post-url-slug" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Content</label>
            <textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="input-field w-full h-32 resize-none" placeholder="Write post content..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Author</label>
              <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="input-field w-full" placeholder="tech, news" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-outline py-2 px-5">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary py-2 px-6">{saving ? 'Saving...' : 'Save Post'}</button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default AdminBlogs;
