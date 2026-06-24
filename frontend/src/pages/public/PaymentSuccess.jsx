import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'failed'
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('failed');
        return;
      }

      try {
        await api.post('/payments/verify/stripe', { sessionId });
        setStatus('success');
      } catch (error) {
        console.error('Payment verification failed:', error);
        toast.error('Payment verification failed');
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full text-center space-y-6 py-12">
        {status === 'verifying' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 size={48} className="text-brand-500 animate-spin" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verifying Payment...</h2>
            <p className="text-slate-500">Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Successful!</h2>
            <p className="text-slate-500">Your order has been confirmed and is being processed.</p>
            <div className="pt-6 w-full flex flex-col gap-3">
              <Link to="/customer/orders" className="btn-primary w-full text-center">View Orders</Link>
              <Link to="/" className="text-brand-600 font-medium hover:underline">Continue Shopping</Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2">
              <X size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Failed</h2>
            <p className="text-slate-500">We could not verify your payment. If you were charged, please contact support.</p>
            <div className="pt-6 w-full">
              <Link to="/customer/orders" className="btn-primary w-full text-center">Go to My Orders</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
