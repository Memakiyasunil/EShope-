import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const Settings = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.put('/users/change-password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="section-title mb-6">Account Settings</h1>
      <form onSubmit={handleSubmit} className="glass-card max-w-lg space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <input type="password" className="input-field" placeholder="Current Password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} required />
        <input type="password" className="input-field" placeholder="New Password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required minLength={6} />
        <input type="password" className="input-field" placeholder="Confirm New Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Updating...' : 'Update Password'}</button>
      </form>
    </div>
  );
};

export default Settings;
