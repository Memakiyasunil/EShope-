import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full text-center space-y-6 py-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2">
            <XCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Cancelled</h2>
          <p className="text-slate-500">Your payment process was cancelled or interrupted. Your order has not been completed.</p>
          <div className="pt-6 w-full flex flex-col gap-3">
            <Link to="/customer/cart" className="btn-primary w-full text-center">Return to Cart</Link>
            <Link to="/customer/orders" className="text-brand-600 font-medium hover:underline">View My Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
