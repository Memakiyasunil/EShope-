import { useState } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/axios';

const emptyForm = { fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', label: 'home' };

const Addresses = () => {
  const { user, refreshUser } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/addresses', form);
      await refreshUser();
      setForm(emptyForm);
      setShowForm(false);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/addresses/${id}`);
      await refreshUser();
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">My Addresses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <Plus size={16} /> Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card mb-6 grid sm:grid-cols-2 gap-4">
          {['fullName', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode'].map((field) => (
            <input key={field} className="input-field" placeholder={field.replace(/([A-Z])/g, ' $1')} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required={field !== 'addressLine2'} />
          ))}
          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">{loading ? 'Saving...' : 'Save Address'}</button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {user?.addresses?.map((addr) => (
          <div key={addr._id} className="glass-card">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <MapPin className="text-brand-600 shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-sm text-slate-500 mt-1">{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                  <p className="text-sm text-slate-500">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-sm text-slate-500">{addr.phone}</p>
                  {addr.isDefault && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded mt-2 inline-block">Default</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(addr._id)} className="text-red-500 p-1"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
