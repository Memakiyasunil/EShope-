import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bell, Users, Store, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';

const AdminNotifications = () => {
  const [form, setForm] = useState({ title: '', message: '', target: 'all_users', type: 'info' });
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    api.get('/notifications/admin/all?limit=20')
      .then(({ data }) => setNotifications(data.notifications || data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return toast.error('Title and message are required');
    setSending(true);
    try {
      await api.post('/notifications/broadcast', form);
      toast.success('Notification sent successfully!');
      setForm({ title: '', message: '', target: 'all_users', type: 'info' });
      fetchNotifications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally { setSending(false); }
  };

  const typeColors = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Notification Center</h1>
        <p className="text-slate-500 mt-1">Broadcast messages to users and sellers</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Send Notification Form */}
        <GlassCard className="p-6 lg:col-span-1">
          <h2 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <Send size={18} className="text-brand-500" /> Send Notification
          </h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Send To</label>
              <select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="input-field w-full">
                <option value="all_users">All Users</option>
                <option value="all_sellers">All Sellers</option>
                <option value="all_buyers">All Buyers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field w-full">
                <option value="info">ℹ️ Info</option>
                <option value="success">✅ Success</option>
                <option value="warning">⚠️ Warning</option>
                <option value="error">🚨 Alert</option>
                <option value="order">📦 Order Update</option>
                <option value="promotion">🎉 Promotion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field w-full" placeholder="Flash Sale is Live!" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Message *</label>
              <textarea required rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input-field w-full resize-none" placeholder="Write your notification message here..." />
            </div>

            {/* Preview */}
            {(form.title || form.message) && (
              <div className={`rounded-xl p-4 border-l-4 ${form.type === 'success' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : form.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : form.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-brand-500 bg-brand-50 dark:bg-brand-900/10'}`}>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Preview</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{form.title}</p>
                <p className="text-xs text-slate-500 mt-1">{form.message}</p>
              </div>
            )}

            <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {sending ? <><RefreshCw size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Notification</>}
            </button>
          </form>
        </GlassCard>

        {/* Notification History */}
        <GlassCard className="p-0 overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell size={18} className="text-brand-500" /> Recent Broadcasts
            </h2>
            <button onClick={fetchNotifications} className="text-xs btn-outline py-1.5 px-3 rounded-xl flex items-center gap-1">
              <RefreshCw size={12} /> Refresh
            </button>
          </div>
          {loading ? <LoadingSkeleton variant="list" count={5} /> : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
              {notifications.length > 0 ? notifications.map(n => (
                <div key={n._id} className="p-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${typeColors[n.type] || typeColors.info}`}>
                      {n.type || 'info'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-slate-400 mt-1.5">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    {n.read && <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-1" />}
                  </div>
                </div>
              )) : (
                <div className="p-16 text-center text-slate-400">
                  <Bell size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No notifications sent yet</p>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default AdminNotifications;
