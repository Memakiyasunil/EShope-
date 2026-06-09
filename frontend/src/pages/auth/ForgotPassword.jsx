import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch {
      setSent(true);
      toast.success('If an account exists, a reset link has been sent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <Mail size={28} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Check your inbox at <strong>{email}</strong> for password reset instructions.
          </p>
          <Link to="/login" className="btn-primary inline-flex">
            <ArrowLeft size={18} /> Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            <Mail size={18} />
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline inline-flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
