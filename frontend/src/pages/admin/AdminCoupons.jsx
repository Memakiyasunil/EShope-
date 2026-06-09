import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, startDate: '', endDate: '' });

  const fetchCoupons = () => {
    api.get('/coupons').then(({ data }) => setCoupons(data.coupons || data.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/coupons', form);
      toast.success('Coupon created');
      setForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 500, startDate: '', endDate: '' });
      fetchCoupons();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <LoadingSkeleton variant="table" count={5} />;

  return (
    <div>
      <h1 className="section-title mb-6">Coupon Management</h1>
      <form onSubmit={handleAdd} className="glass-card grid sm:grid-cols-3 gap-4 mb-6">
        <input className="input-field" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
        <select className="input-field" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input className="input-field" type="number" placeholder="Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
        <input className="input-field" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        <input className="input-field" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
        <button type="submit" className="btn-primary"><Plus size={16} /> Add Coupon</button>
      </form>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="text-left p-3">Code</th><th className="text-left p-3">Discount</th><th className="text-left p-3">Used</th><th className="text-left p-3">Active</th></tr></thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b">
                <td className="p-3 font-mono font-medium">{c.code}</td>
                <td className="p-3">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td className="p-3">{c.usedCount}/{c.usageLimit || '∞'}</td>
                <td className="p-3">{c.isActive ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
