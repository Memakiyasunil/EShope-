import { useEffect, useState } from 'react';
import { CreditCard, Check, X, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import api from '../../utils/axios';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/finances/withdrawals');
      setWithdrawals(res.data.data?.withdrawals || []);
    } catch (err) {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    const note = prompt(`Enter an optional note for marking this ${status}:`);
    if (note === null) return; // cancelled prompt
    
    let transactionId = '';
    if (status === 'completed') {
      transactionId = prompt('Enter the Bank Transaction ID or UTR number:');
      if (!transactionId) {
        toast.error('Transaction ID is required to complete a payout');
        return;
      }
    }

    setProcessingId(id);
    try {
      await api.put(`/finances/withdrawals/${id}`, { status, adminNote: note, transactionId });
      toast.success(`Withdrawal marked as ${status}`);
      fetchWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <LoadingSkeleton variant="table" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payout Requests</h1>
          <p className="text-slate-500">Manage seller withdrawals and wallet payouts</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Seller / Shop</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Amount</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Method</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Bank Details</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Status</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300">Date</th>
                <th className="p-4 font-medium text-slate-600 dark:text-slate-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {withdrawals.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No withdrawal requests found.</td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <tr key={w._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900 dark:text-white">{w.seller?.shopName || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{w.seller?.email}</div>
                    </td>
                    <td className="p-4 font-bold text-brand-600 dark:text-brand-400">₹{w.amount?.toLocaleString()}</td>
                    <td className="p-4 uppercase text-xs font-semibold">{w.paymentMethod?.replace('_', ' ')}</td>
                    <td className="p-4 text-xs text-slate-500">
                      <div>A/C: {w.bankDetails?.accountNumber || 'N/A'}</div>
                      <div>IFSC: {w.bankDetails?.ifscCode || 'N/A'}</div>
                      <div className="truncate w-32">{w.bankDetails?.bankName}</div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={w.status} />
                    </td>
                    <td className="p-4 text-slate-500 text-xs">
                      {new Date(w.createdAt).toLocaleDateString()}<br/>
                      {new Date(w.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {w.status === 'pending' && (
                        <button 
                          onClick={() => handleStatusUpdate(w._id, 'processing')}
                          disabled={processingId === w._id}
                          className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                          title="Mark as Processing"
                        >
                          <Clock size={16} />
                        </button>
                      )}
                      {(w.status === 'pending' || w.status === 'processing') && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(w._id, 'completed')}
                            disabled={processingId === w._id}
                            className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(w._id, 'rejected')}
                            disabled={processingId === w._id}
                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                            title="Reject Request"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminWithdrawals;
