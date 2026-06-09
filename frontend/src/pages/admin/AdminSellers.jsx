import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';

const AdminSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = () => {
    api.get('/sellers')
      .then(({ data }) => setSellers(data.sellers || data.data?.sellers || []))
      .catch(() => setSellers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSellers(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/sellers/${id}/status`, { status });
      toast.success(`Seller ${status}`);
      fetchSellers();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSkeleton variant="table" count={5} />;

  return (
    <div>
      <h1 className="section-title mb-6">Seller Management</h1>
      <div className="space-y-4">
        {sellers.map((s) => (
          <div key={s._id} className="glass-card flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {s.logo && <img src={s.logo} alt="" className="w-12 h-12 rounded-full object-cover" />}
              <div>
                <p className="font-semibold">{s.shopName}</p>
                <p className="text-sm text-slate-500">{s.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={s.status} />
              {s.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(s._id, 'approved')} className="btn-primary text-xs py-1.5">Approve</button>
                  <button onClick={() => updateStatus(s._id, 'rejected')} className="btn-outline text-xs py-1.5 text-red-500">Reject</button>
                </>
              )}
              {s.status === 'approved' && (
                <button onClick={() => updateStatus(s._id, 'suspended')} className="btn-outline text-xs py-1.5">Suspend</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSellers;
