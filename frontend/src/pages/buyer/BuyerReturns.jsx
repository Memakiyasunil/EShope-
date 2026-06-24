import { useState, useEffect } from 'react';
import { RefreshCcw, Search, ChevronDown, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../utils/axios';

const BuyerReturns = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch delivered orders that are eligible for return
        const { data } = await api.get('/orders/my-orders');
        const eligibleOrders = (data.data || []).filter(
          (order) => order.status === 'delivered'
        );
        setOrders(eligibleOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !reason) {
      return toast.error('Please select an order and provide a reason');
    }

    setSubmitting(true);
    try {
      // Since there's no dedicated returns API yet, we simulate the request
      // In a real scenario, this would be: await api.post('/returns', { orderId: selectedOrder, reason })
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Return request submitted successfully');
      setSuccess(true);
      setReason('');
      setSelectedOrder('');
    } catch (error) {
      toast.error('Failed to submit return request');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Returns & Refunds</h1>
        <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Submitted</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Your return request has been successfully submitted. Our team will review it and get back to you within 24-48 hours.
          </p>
          <button onClick={() => setSuccess(false)} className="btn-primary">
            Submit Another Return
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Returns & Refunds</h1>
          <p className="text-slate-500">Request a return for your delivered orders</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Initiate a Return</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Select Order to Return
              </label>
              <div className="relative">
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="input-field w-full appearance-none pr-10"
                  disabled={loading || orders.length === 0}
                >
                  <option value="">{loading ? 'Loading orders...' : 'Select an eligible order'}</option>
                  {orders.map((order) => (
                    <option key={order._id} value={order._id}>
                      Order #{order.orderNumber} - {new Date(order.createdAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
              {orders.length === 0 && !loading && (
                <p className="text-xs text-amber-500 mt-2">You have no delivered orders eligible for return.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Reason for Return
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field w-full min-h-[120px] resize-none"
                placeholder="Please explain why you want to return this item..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedOrder || !reason}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-brand-50/50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 rounded-lg">
                <RefreshCcw size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Return Policy</h3>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-4">
                  <li>Items must be returned within 30 days of delivery.</li>
                  <li>Items must be unused and in original packaging.</li>
                  <li>Refunds will be processed to the original payment method within 5-7 business days.</li>
                  <li>Shipping costs for returns are deducted from the refund unless the item was defective.</li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default BuyerReturns;
