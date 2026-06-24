import { useState } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const SellerEarnings = () => {
  const [transactions] = useState([
    { id: 'TRX-9821', date: '2023-11-20', type: 'Order Revenue', orderId: 'ORD-5542', amount: '+$145.00', status: 'cleared' },
    { id: 'TRX-9822', date: '2023-11-19', type: 'Order Revenue', orderId: 'ORD-5541', amount: '+$89.00', status: 'cleared' },
    { id: 'TRX-9823', date: '2023-11-18', type: 'Withdrawal', orderId: '-', amount: '-$1,200.00', status: 'processing' },
    { id: 'TRX-9824', date: '2023-11-18', type: 'Platform Fee', orderId: 'ORD-5540', amount: '-$12.50', status: 'cleared' },
    { id: 'TRX-9825', date: '2023-11-17', type: 'Order Revenue', orderId: 'ORD-5540', amount: '+$125.00', status: 'cleared' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earnings & Wallet</h1>
          <p className="text-slate-500">Track your available balance and transactions</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <DollarSign size={18} /> Request Withdrawal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="p-6 bg-brand-500 text-white border-transparent relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-brand-100 text-sm font-medium mb-1">Available to Withdraw</p>
          <h3 className="text-4xl font-bold text-white mb-4">$4,250.00</h3>
          <p className="text-xs text-brand-100 flex items-center gap-1">
            <CheckCircle size={14} /> Ready for payout
          </p>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Pending Clearance</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$850.00</h3>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">From orders within the last 7 days</p>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium">Net Earnings (This Month)</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">$12,450.00</h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
              <ArrowUpRight size={24} />
            </div>
          </div>
          <p className="text-xs text-green-500 mt-4 font-medium flex items-center gap-1">
            <ArrowUpRight size={14} /> +15.3% from last month
          </p>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
              <tr>
                <th className="p-4 font-medium">Transaction ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Order Ref</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-500">{trx.id}</td>
                  <td className="p-4 font-medium text-slate-900 dark:text-white">{trx.date}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{trx.type}</td>
                  <td className="p-4 text-brand-600 hover:underline cursor-pointer">{trx.orderId}</td>
                  <td className={`p-4 font-bold ${trx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {trx.amount}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      trx.status === 'cleared' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default SellerEarnings;
