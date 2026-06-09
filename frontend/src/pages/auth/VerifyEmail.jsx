import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification');
      toast.success('Verification email resent');
    } catch {
      toast.success('Verification email sent if account exists');
    } finally {
      setResending(false);
    }
  };

  if (token) {
    api.post('/auth/verify-email', { token })
      .then(() => setVerified(true))
      .catch(() => {});
  }

  if (verified) {
    return (
      <div className="glass-card text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Verified!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Your email has been successfully verified. You can now access all features.
        </p>
        <Link to="/login" className="btn-primary">Continue to Login</Link>
      </div>
    );
  }

  return (
    <div className="glass-card text-center">
      <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail size={32} className="text-brand-600 dark:text-brand-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Verify Your Email</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
      </p>

      <button onClick={handleResend} disabled={resending} className="btn-secondary mb-4">
        <RefreshCw size={18} className={resending ? 'animate-spin' : ''} />
        {resending ? 'Resending...' : 'Resend Verification Email'}
      </button>

      <p className="text-sm text-slate-500">
        Already verified?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default VerifyEmail;
