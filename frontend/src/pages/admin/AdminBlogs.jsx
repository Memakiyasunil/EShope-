import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs')
      .then(({ data }) => setBlogs(data.blogs || data.data || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="list" count={4} />;

  return (
    <div>
      <h1 className="section-title mb-6">Blog Management</h1>
      <div className="space-y-4">
        {blogs.map((b) => (
          <div key={b._id} className="glass-card flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-sm text-slate-500">{b.excerpt}</p>
              <span className={`text-xs mt-1 inline-block ${b.isPublished ? 'text-green-600' : 'text-slate-400'}`}>
                {b.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <span className="text-sm text-slate-400">{new Date(b.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {!blogs.length && <div className="glass-card text-center py-12 text-slate-500">No blogs yet</div>}
      </div>
    </div>
  );
};

export default AdminBlogs;
