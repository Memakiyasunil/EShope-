import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

const SellerRegister = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shopName: '',
    description: '',
    category: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    taxId: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in first to register as a seller');
      navigate('/login', { state: { from: { pathname: '/seller-register' } } });
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/seller-register', form);
      toast.success('Seller application submitted! We will review it shortly.');
      navigate('/dashboard/seller');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Store size={32} className="text-brand-600 dark:text-brand-400" />
        </div>
        <h1 className="section-title">Become a Seller</h1>
        <p className="section-subtitle">
          Start selling on E-Shop Online and reach millions of customers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-5">
        <div>
          <label className="label-text">Shop Name *</label>
          <input
            type="text"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Your shop name"
          />
        </div>

        <div>
          <label className="label-text">Shop Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="input-field resize-none"
            placeholder="Tell customers about your shop..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Primary Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label-text">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="+1 (234) 567-890"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Business Address *</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Street address"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-text">City *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="City"
            />
          </div>
          <div>
            <label className="label-text">Country *</label>
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Country"
            />
          </div>
        </div>

        <div>
          <label className="label-text">Tax ID / Business Registration</label>
          <input
            type="text"
            name="taxId"
            value={form.taxId}
            onChange={handleChange}
            className="input-field"
            placeholder="Optional"
          />
        </div>

        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
          <Upload size={32} className="mx-auto text-slate-400 mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Drag & drop shop logo here, or click to browse
          </p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <Store size={18} />
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Already a seller?{' '}
        <Link to="/seller" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
          Go to Seller Dashboard
        </Link>
      </p>
    </div>
  );
};

export default SellerRegister;
