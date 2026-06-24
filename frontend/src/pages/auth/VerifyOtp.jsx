import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { useDispatch } from 'react-redux';
import { verifyOtpUser } from '../../store/slices/authSlice';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useAuth();
  const dispatch = useDispatch();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const result = await dispatch(verifyOtpUser({ email, otp }));
      if (verifyOtpUser.fulfilled.match(result)) {
        toast.success('Email verified successfully! Welcome.');
        navigate('/');
      } else {
        toast.error(result.payload || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('Verification failed');
    }
  };

  return (
    <div className="glass-card max-w-md mx-auto mt-20">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verify Your Email</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          We've sent a 6-digit code to <span className="font-medium text-slate-900 dark:text-white">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="label-text text-center block mb-4">Enter 6-digit OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            required
            className="input-field text-center text-2xl tracking-[0.5em] font-mono h-14"
            placeholder="000000"
          />
        </div>

        <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full">
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Didn't receive the code?{' '}
        <button 
          onClick={() => navigate('/register')} 
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          Try registering again
        </button>
      </p>
    </div>
  );
};

export default VerifyOtp;
