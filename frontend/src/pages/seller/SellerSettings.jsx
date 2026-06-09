import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const SellerSettings = () => {
  const [form, setForm] = useState({ shopName: '', description: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/sellers/profile').then(({ data }) => {
      const s = data.seller || data.data || data;
      setForm({ shopName: s.shopName || '', description: s.description || '', phone: s.phone || '', email: s.email || '' });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/sellers/profile', form);
      toast.success('Shop profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="section-title mb-6">Shop Settings</h1>
      <form onSubmit={handleSubmit} className="glass-card max-w-lg space-y-4">
        <input className="input-field" placeholder="Shop Name" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} required />
        <textarea className="input-field" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input-field" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
};

export default SellerSettings;
