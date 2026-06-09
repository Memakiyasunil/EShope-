import { useEffect, useState } from 'react';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/banners')
      .then(({ data }) => setBanners(data.banners || data.data || []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={3} />;

  return (
    <div>
      <h1 className="section-title mb-6">Banner Management</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => (
          <div key={b._id} className="glass-card overflow-hidden p-0">
            <img src={b.image} alt={b.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{b.title}</h3>
              <p className="text-sm text-slate-500">{b.subtitle}</p>
              <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded ${b.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {b.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;
