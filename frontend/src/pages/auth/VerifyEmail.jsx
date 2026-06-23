import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !verified) {
      setLoading(true);
      api.get(`/auth/verify-email/${token}`)
        .then(() => {
          setVerified(true);
          toast.success('Email verified successfully!');
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || 'Verification failed or link expired');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, verified]);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification');
      toast.success('Verification email resent. Please check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card text-center py-12">
        <RefreshCw size={48} className="mx-auto mb-4 text-brand-500 animate-spin" />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verifying your email...</h1>
        <p className="text-slate-500">Please wait while we verify your account.</p>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="glass-card text-center py-12">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Email Verified!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">
          Your email has been successfully verified. You now have full access to your account features.
        </p>
        <Link to="/customer" className="btn-primary w-full py-3 text-lg">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="glass-card text-center py-8">
      <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail size={40} className="text-brand-600 dark:text-brand-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Verify Your Email</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
      </p>

      <button onClick={handleResend} disabled={resending} className="btn-secondary w-full py-3 mb-6 flex justify-center items-center gap-2">
        <RefreshCw size={20} className={resending ? 'animate-spin' : ''} />
        {resending ? 'Resending...' : 'Resend Verification Email'}
      </button>

      <p className="text-sm text-slate-500">
        Already verified?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default VerifyEmail;
