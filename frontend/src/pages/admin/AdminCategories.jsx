import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  const fetchCategories = () => {
    api.get('/categories').then(({ data }) => setCategories(data.categories || data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name });
      setName('');
      toast.success('Category added');
      fetchCategories();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Deleted');
      fetchCategories();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSkeleton variant="list" count={5} />;

  return (
    <div>
      <h1 className="section-title mb-6">Category Management</h1>
      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input className="input-field flex-1 max-w-sm" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required />
        <button type="submit" className="btn-primary"><Plus size={16} /> Add</button>
      </form>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c._id} className="glass-card">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{c.subCategories?.length || 0} sub-categories</p>
              </div>
              <button onClick={() => handleDelete(c._id)} className="text-red-500 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
