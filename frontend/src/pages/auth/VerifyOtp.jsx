import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { verifyOtpUser } from '../../store/slices/authSlice';
import api from '../../utils/axios';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  
  const email = location.state?.email;
  const type = location.state?.type || 'register'; // 'register' or 'reset'

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only last char if multiple entered
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Auto-retreat
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      if (pastedData[i] && !isNaN(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    
    // Focus last filled input
    const lastFilled = newOtp.findLastIndex(val => val !== '');
    if (lastFilled < 5) {
      inputRefs.current[lastFilled + 1]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResendLoading(true);
    try {
      if (type === 'reset') {
        await api.post('/auth/resend-otp', { email });
      } else {
        // For registration, we can just resend via the same forgot-password logic or a specialized one, 
        // but let's assume /resend-otp works for both if the user is in DB.
        await api.post('/auth/resend-otp', { email });
      }
      toast.success('New OTP has been sent successfully.');
      setCountdown(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      if (type === 'reset') {
        const { data } = await api.post('/auth/verify-password-reset-otp', { email, otp: otpValue });
        toast.success('OTP verified successfully!');
        navigate('/reset-password', { state: { email, resetToken: data.data.resetToken } });
      } else {
        const result = await dispatch(verifyOtpUser({ email, otp: otpValue }));
        if (verifyOtpUser.fulfilled.match(result)) {
          toast.success('Email verified successfully! Welcome.');
          navigate('/');
        } else {
          toast.error(result.payload || 'Invalid OTP');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="glass-card max-w-md mx-auto mt-10 md:mt-20"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verify Your Account</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Enter the 6-digit verification code sent to <br/><span className="font-medium text-slate-900 dark:text-white">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/20 transition-all outline-none shadow-sm"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button type="submit" disabled={loading || otp.join('').length !== 6} className="btn-primary w-full shadow-[0_4px_14px_rgba(0,112,243,0.3)]">
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-700 pt-6">
        {countdown > 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
            <RefreshCw size={14} className="animate-spin text-slate-400" />
            Resend OTP in {countdown}s
          </p>
        ) : (
          <button 
            onClick={handleResend} 
            disabled={resendLoading}
            className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors flex items-center justify-center gap-1.5 mx-auto disabled:opacity-50"
          >
            <RefreshCw size={14} className={resendLoading ? 'animate-spin' : ''} />
            {resendLoading ? 'Sending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default VerifyOtp;
