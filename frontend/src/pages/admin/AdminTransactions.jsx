import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, TrendingUp, DollarSign, Wallet } from 'lucide-react';
import api from '../../utils/axios';
import GlassCard from '../../components/ui/GlassCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';

const AdminTransactions = () => {
  const [finances, setFinances] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [finRes, ordRes] = await Promise.all([
          api.get('/analytics/finances'),
          api.get(`/orders/all?page=${page}&limit=12`)
        ]);
        setFinances(finRes.data.data || finRes.data);
        const ordData = ordRes.data.data || ordRes.data;
        setOrders(ordData.orders || ordData || []);
        const pg = ordData.pagination || {};
        setTotalPages(pg.totalPages || pg.pages || 1);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Transactions & Revenue</h1>
          <p className="text-slate-500 mt-1">Platform financial overview and commissions</p>
        </div>
      </div>

      {loading && !finances ? <LoadingSkeleton variant="card" count={4} /> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
            <DollarSign size={24} className="text-blue-500 mb-3" />
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(finances?.totalTurnover || 0).toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Total Turnover</p>
          </GlassCard>
          <GlassCard className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-100 dark:border-emerald-800">
            <TrendingUp size={24} className="text-emerald-500 mb-3" />
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{(finances?.totalIncome || 0).toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Platform Revenue (10%)</p>
          </GlassCard>
          <GlassCard className="p-5">
            <Wallet size={24} className="text-purple-500 mb-3" />
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(finances?.totalWalletBalances || 0).toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Sellers Wallet Balance</p>
          </GlassCard>
          <GlassCard className="p-5">
            <Download size={24} className="text-orange-500 mb-3" />
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{(finances?.totalGeneratedPayouts || 0).toLocaleString()}</p>
            <p className="text-xs font-bold text-slate-500 uppercase mt-1">Total Payouts Issued</p>
          </GlassCard>
        </div>
      )}

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/70 dark:bg-slate-800/40">
              <tr className="border-b border-slate-200/50 dark:border-slate-700/50 text-slate-500">
                <th className="text-left px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Order</th>
                <th className="text-left px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Customer</th>
                <th className="text-left px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Status</th>
                <th className="text-right px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Order Total</th>
                <th className="text-right px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Commission (10%)</th>
                <th className="text-right px-5 py-3 font-bold text-[10px] uppercase tracking-widest">Seller Earning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : orders.length > 0 ? orders.map(o => {
                const total = o.totalPrice || 0;
                const commission = total * 0.10;
                const earning = total - commission;
                return (
                  <tr key={o._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3 font-bold text-brand-600">#{o.orderNumber}</td>
                    <td className="px-5 py-3">{o.user?.name || '—'}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-right font-semibold">₹{total.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-bold text-emerald-600">+₹{commission.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-slate-500 font-medium">₹{earning.toLocaleString()}</td>
                  </tr>
                );
              }) : <tr><td colSpan={6} className="px-5 py-16 text-center text-slate-400">No transactions found</td></tr>}
            </tbody>
          </table>
        </div>
      </GlassCard>
      
      {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
    </motion.div>
  );
};

export default AdminTransactions;
