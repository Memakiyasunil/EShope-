import { CreditCard, Plus, ShieldCheck, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const BuyerPaymentMethods = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment Methods</h1>
          <p className="text-slate-500">Manage your saved credit cards and payment options</p>
        </div>
        <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={18} /> Add Payment Method
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-10 bg-slate-900 dark:bg-white rounded flex items-center justify-center">
                  <span className="text-white dark:text-slate-900 font-bold italic text-xl">VISA</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Visa ending in 4242</h3>
                  <p className="text-sm text-slate-500">Expires 12/2026</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-full">
                <CheckCircle size={12} /> Default
              </span>
            </div>
            <div className="mt-6 flex gap-4 text-sm relative z-10">
              <button className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Edit</button>
              <button className="text-red-500 hover:text-red-600 font-medium transition-colors">Remove</button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 relative overflow-hidden group border-dashed border-2 border-slate-200 dark:border-slate-700 bg-transparent shadow-none hover:border-brand-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-center min-h-[160px]">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Add New Card</h3>
            <p className="text-sm text-slate-500">Securely save another card for faster checkout</p>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Secure Payments</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  We use industry-standard encryption to protect your payment details. We never store your full credit card number or CVV on our servers.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default BuyerPaymentMethods;
