import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const resetToken = location.state?.resetToken;

  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !resetToken) {
      toast.error('Invalid password reset session. Please start again.');
      navigate('/forgot-password');
    }
  }, [email, resetToken, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Password Strength Checker
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength(form.password);
  
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 5) {
      toast.error('Please enter a strong password meeting all criteria');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, resetToken, newPassword: form.password });
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="glass-card max-w-md mx-auto mt-10 md:mt-20 text-center py-10"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
        </motion.div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">Password Reset Successfully</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Your password has been updated. You can now login with your new credentials.
        </p>
        <Link to="/login" className="btn-primary w-full inline-block py-3 shadow-[0_4px_14px_rgba(0,112,243,0.3)] hover:-translate-y-0.5 transition-transform">
          Back To Login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card max-w-md mx-auto mt-10 md:mt-20"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Password</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Your new password must be different from previous used passwords.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-text">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-field pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {form.password && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div 
                    key={level} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= strength ? strengthColors[strength - 1] : 'bg-slate-200 dark:bg-slate-700'}`} 
                  />
                ))}
              </div>
              <p className={`text-xs font-semibold ${strength === 5 ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                {strength === 5 ? '✓ Strong Password' : strengthLabels[strength - 1]}
              </p>
              
              <ul className="text-xs text-slate-500 mt-2 space-y-1">
                <li className={form.password.length >= 8 ? 'text-green-600' : ''}>• Minimum 8 characters</li>
                <li className={/[A-Z]/.test(form.password) ? 'text-green-600' : ''}>• 1 Uppercase letter</li>
                <li className={/[a-z]/.test(form.password) ? 'text-green-600' : ''}>• 1 Lowercase letter</li>
                <li className={/[0-9]/.test(form.password) ? 'text-green-600' : ''}>• 1 Number</li>
                <li className={/[^A-Za-z0-9]/.test(form.password) ? 'text-green-600' : ''}>• 1 Special character</li>
              </ul>
            </motion.div>
          )}
        </div>

        <div>
          <label className="label-text">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="Confirm your password"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || strength < 5 || form.password !== form.confirmPassword} 
          className="btn-primary w-full shadow-[0_4px_14px_rgba(0,112,243,0.3)] mt-2"
        >
          <Lock size={18} />
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </motion.div>
  );
};

export default ResetPassword;
