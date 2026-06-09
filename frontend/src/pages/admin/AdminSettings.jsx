import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const AdminSettings = () => {
  const [form, setForm] = useState({ siteName: '', siteTagline: '', contactEmail: '', contactPhone: '', freeDeliveryThreshold: 999, taxRate: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      const s = data.settings || data.data || data;
      setForm({ siteName: s.siteName || '', siteTagline: s.siteTagline || '', contactEmail: s.contactEmail || '', contactPhone: s.contactPhone || '', freeDeliveryThreshold: s.freeDeliveryThreshold || 999, taxRate: s.taxRate || 5 });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings saved');
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="section-title mb-6">Website Settings</h1>
      <form onSubmit={handleSubmit} className="glass-card max-w-lg space-y-4">
        <input className="input-field" placeholder="Site Name" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
        <input className="input-field" placeholder="Tagline" value={form.siteTagline} onChange={(e) => setForm({ ...form, siteTagline: e.target.value })} />
        <input className="input-field" placeholder="Contact Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
        <input className="input-field" placeholder="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
        <input className="input-field" type="number" placeholder="Free Delivery Threshold" value={form.freeDeliveryThreshold} onChange={(e) => setForm({ ...form, freeDeliveryThreshold: e.target.value })} />
        <input className="input-field" type="number" placeholder="Tax Rate %" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Settings'}</button>
      </form>
    </div>
  );
};

export default AdminSettings;
