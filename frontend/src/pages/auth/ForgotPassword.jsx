import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email');
      navigate('/verify-otp', { state: { email, type: 'reset' } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card max-w-md mx-auto mt-10 md:mt-20"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Enter your email and we&apos;ll send you a 6-digit OTP to reset your password.
        </p>
      </div>

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

        <button type="submit" disabled={loading} className="btn-primary w-full shadow-[0_4px_14px_rgba(0,112,243,0.3)]">
          <Mail size={18} />
          {loading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline inline-flex items-center gap-1 transition-all duration-300 hover:gap-2">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </p>
    </motion.div>
  );
};

export default ForgotPassword;
