import { useState } from 'react';
import { Landmark, ArrowRightLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';

const SellerWithdrawals = () => {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [history] = useState([
    { id: 'W-981', date: '2023-11-15', amount: '$1,200.00', method: 'Bank Transfer (ending 4291)', status: 'completed' },
    { id: 'W-942', date: '2023-10-28', amount: '$850.00', method: 'Bank Transfer (ending 4291)', status: 'completed' },
    { id: 'W-893', date: '2023-10-10', amount: '$2,100.00', method: 'Bank Transfer (ending 4291)', status: 'completed' },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !bankAccount) return toast.error('Please fill in all fields');
    if (parseFloat(amount) < 50) return toast.error('Minimum withdrawal amount is $50');
    if (parseFloat(amount) > 4250) return toast.error('Insufficient funds');

    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Withdrawal request submitted successfully');
      setAmount('');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Withdrawals</h1>
          <p className="text-slate-500">Request payouts and view withdrawal history</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-1 border-brand-500 border-t-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Request Payout</h2>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-500 mb-1">Available Balance</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">$4,250.00</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Withdrawal Amount ($)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="50"
                step="0.01"
                className="input-field w-full text-lg"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum amount: $50.00</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payout Method
              </label>
              <select
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="input-field w-full"
              >
                <option value="">Select an account</option>
                <option value="bank_1">Bank of America (ending in 4291)</option>
                <option value="paypal">PayPal (seller@eshop.com)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting || !amount || !bankAccount}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {submitting ? 'Processing...' : 'Submit Request'}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-blue-700 dark:text-blue-400">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <p>Payouts usually take 2-3 business days to reflect in your bank account depending on your bank's processing times.</p>
          </div>
        </GlassCard>

        <GlassCard className="p-0 overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Withdrawal History</h2>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left h-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <tr>
                  <th className="p-4 font-medium">Ref ID</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Method</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="p-4 font-mono text-sm text-slate-500">{item.id}</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{item.date}</td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">{item.amount}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Landmark size={14} />
                        {item.method}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold capitalize bg-green-100 text-green-700 flex items-center gap-1 w-max">
                        <CheckCircle size={12} /> {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SellerWithdrawals;
