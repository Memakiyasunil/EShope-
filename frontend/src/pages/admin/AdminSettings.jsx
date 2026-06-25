import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, CreditCard, Percent, Wrench, Share2, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';

const TABS = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'email', label: 'Email / SMTP', icon: Mail },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'finance', label: 'Tax & Delivery', icon: Percent },
  { key: 'social', label: 'Social Links', icon: Share2 },
  { key: 'maintenance', label: 'Maintenance', icon: Wrench },
];

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      const s = data.settings || data.data || {};
      setSettings(s);
      setForm({
        // General
        siteName: s.siteName || '', siteTagline: s.siteTagline || '',
        contactEmail: s.contactEmail || '', contactPhone: s.contactPhone || '',
        address: s.address || '', currency: s.currency || 'INR', currencySymbol: s.currencySymbol || '₹',
        // Finance
        taxRate: s.taxRate || 18, defaultDeliveryCharge: s.defaultDeliveryCharge || 49,
        freeDeliveryThreshold: s.freeDeliveryThreshold || 999, platformCommission: s.platformCommission || 10,
        // SEO
        metaTitle: s.seo?.metaTitle || '', metaDescription: s.seo?.metaDescription || '',
        // Social
        facebook: s.socialLinks?.facebook || '', twitter: s.socialLinks?.twitter || '',
        instagram: s.socialLinks?.instagram || '', youtube: s.socialLinks?.youtube || '',
        linkedin: s.socialLinks?.linkedin || '',
        // Payments
        razorpay: s.paymentMethods?.razorpay ?? true,
        stripe: s.paymentMethods?.stripe ?? true,
        cod: s.paymentMethods?.cod ?? true,
        // Maintenance
        maintenanceMode: s.maintenanceMode || false,
        maintenanceMessage: s.maintenanceMessage || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        siteName: form.siteName, siteTagline: form.siteTagline,
        contactEmail: form.contactEmail, contactPhone: form.contactPhone,
        address: form.address, currency: form.currency, currencySymbol: form.currencySymbol,
        taxRate: Number(form.taxRate), defaultDeliveryCharge: Number(form.defaultDeliveryCharge),
        freeDeliveryThreshold: Number(form.freeDeliveryThreshold),
        platformCommission: Number(form.platformCommission),
        seo: { metaTitle: form.metaTitle, metaDescription: form.metaDescription },
        socialLinks: { facebook: form.facebook, twitter: form.twitter, instagram: form.instagram, youtube: form.youtube, linkedin: form.linkedin },
        paymentMethods: { razorpay: form.razorpay, stripe: form.stripe, cod: form.cod },
        maintenanceMode: form.maintenanceMode, maintenanceMessage: form.maintenanceMessage,
      };
      await api.put('/settings', payload);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const InputField = ({ label, id, type = 'text', value, onChange, placeholder }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} className="input-field w-full" placeholder={placeholder} />
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-brand-500" size={32} /></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Website Settings</h1>
          <p className="text-slate-500 mt-1">Configure your platform settings</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 py-2.5 px-6">
          {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Tab Navigation */}
        <GlassCard className="p-3 h-fit">
          <nav className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </GlassCard>

        {/* Tab Content */}
        <GlassCard className="p-6 lg:col-span-3 space-y-5">
          {activeTab === 'general' && (
            <>
              <h2 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">General Settings</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Site Name" id="siteName" value={form.siteName} onChange={e => set('siteName', e.target.value)} placeholder="E-Shop Online" />
                <InputField label="Tagline" id="siteTagline" value={form.siteTagline} onChange={e => set('siteTagline', e.target.value)} placeholder="Your Marketplace" />
                <InputField label="Contact Email" id="contactEmail" type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="support@eshop.com" />
                <InputField label="Contact Phone" id="contactPhone" value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} placeholder="+91 9999999999" />
                <InputField label="Currency Code" id="currency" value={form.currency} onChange={e => set('currency', e.target.value)} placeholder="INR" />
                <InputField label="Currency Symbol" id="currencySymbol" value={form.currencySymbol} onChange={e => set('currencySymbol', e.target.value)} placeholder="₹" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
                <textarea value={form.address} onChange={e => set('address', e.target.value)} className="input-field w-full h-24 resize-none" placeholder="123, Business District..." />
              </div>
              <h3 className="font-bold text-slate-700 dark:text-slate-300 pt-2">SEO Settings</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Meta Title" id="metaTitle" value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="E-Shop Online - Best Deals" />
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Meta Description</label>
                  <textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} className="input-field w-full h-20 resize-none" placeholder="Discover thousands of products..." />
                </div>
              </div>
            </>
          )}

          {activeTab === 'email' && (
            <>
              <h2 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Email / SMTP Settings</h2>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 text-sm text-amber-700 dark:text-amber-400">
                ⚠️ SMTP settings are configured via environment variables on the server. Email: <strong>{form.contactEmail || 'Not set'}</strong>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="From Email" id="fromEmail" type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} placeholder="noreply@eshop.com" />
                <InputField label="From Name" id="fromName" value={form.siteName} onChange={e => set('siteName', e.target.value)} placeholder="E-Shop Online" />
              </div>
              <p className="text-sm text-slate-500">SMTP Host, Port, Username, and Password must be set in the backend <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">.env</code> file as <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">EMAIL_HOST</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs">EMAIL_PORT</code>, etc.</p>
            </>
          )}

          {activeTab === 'payments' && (
            <>
              <h2 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Payment Gateways</h2>
              <div className="space-y-4">
                {[
                  { key: 'razorpay', label: 'Razorpay', desc: 'Indian payment gateway supporting UPI, cards, net banking', color: 'bg-blue-500' },
                  { key: 'stripe', label: 'Stripe', desc: 'International payment gateway for global customers', color: 'bg-purple-500' },
                  { key: 'cod', label: 'Cash on Delivery (COD)', desc: 'Allow customers to pay when their order is delivered', color: 'bg-emerald-500' },
                ].map(pm => (
                  <div key={pm.key} className={`flex items-center justify-between p-4 rounded-xl border ${form[pm.key] ? 'border-brand-200 bg-brand-50 dark:bg-brand-900/10 dark:border-brand-800' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30'} transition-colors`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${pm.color} rounded-xl flex items-center justify-center text-white font-bold text-xs`}>
                        {pm.label.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{pm.label}</p>
                        <p className="text-xs text-slate-500">{pm.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => set(pm.key, !form[pm.key])}
                      className={`relative w-12 h-6 rounded-full transition-colors ${form[pm.key] ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[pm.key] ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'finance' && (
            <>
              <h2 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Tax & Delivery Settings</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="GST / Tax Rate (%)" id="taxRate" type="number" value={form.taxRate} onChange={e => set('taxRate', e.target.value)} placeholder="18" />
                <InputField label="Platform Commission (%)" id="platformCommission" type="number" value={form.platformCommission} onChange={e => set('platformCommission', e.target.value)} placeholder="10" />
                <InputField label="Default Delivery Charge (₹)" id="defaultDeliveryCharge" type="number" value={form.defaultDeliveryCharge} onChange={e => set('defaultDeliveryCharge', e.target.value)} placeholder="49" />
                <InputField label="Free Delivery Above (₹)" id="freeDeliveryThreshold" type="number" value={form.freeDeliveryThreshold} onChange={e => set('freeDeliveryThreshold', e.target.value)} placeholder="999" />
              </div>
            </>
          )}

          {activeTab === 'social' && (
            <>
              <h2 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Social Media Links</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'facebook', label: 'Facebook URL' },
                  { key: 'twitter', label: 'Twitter / X URL' },
                  { key: 'instagram', label: 'Instagram URL' },
                  { key: 'youtube', label: 'YouTube URL' },
                  { key: 'linkedin', label: 'LinkedIn URL' },
                ].map(s => (
                  <InputField key={s.key} label={s.label} id={s.key} value={form[s.key]} onChange={e => set(s.key, e.target.value)} placeholder={`https://${s.key}.com/eshop`} />
                ))}
              </div>
            </>
          )}

          {activeTab === 'maintenance' && (
            <>
              <h2 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Maintenance Mode</h2>
              <div className={`p-5 rounded-xl border-2 ${form.maintenanceMode ? 'border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50' : 'border-slate-200 dark:border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Maintenance Mode</p>
                    <p className="text-sm text-slate-500">{form.maintenanceMode ? '⚠️ Site is currently in maintenance mode — visitors see the maintenance page' : 'Site is live and accessible to all users'}</p>
                  </div>
                  <button
                    onClick={() => set('maintenanceMode', !form.maintenanceMode)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${form.maintenanceMode ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                  >
                    <span className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.maintenanceMode ? 'left-8' : 'left-1.5'}`} />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Maintenance Message</label>
                  <textarea value={form.maintenanceMessage} onChange={e => set('maintenanceMessage', e.target.value)} className="input-field w-full h-24 resize-none" placeholder="We're currently updating our website. We'll be back shortly..." />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 py-2.5 px-8">
              {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
