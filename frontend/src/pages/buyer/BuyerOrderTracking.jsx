import { useState } from 'react';
import { Search, Package, CheckCircle, Clock, Truck, Home } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';
import api from '../../utils/axios';

const BuyerOrderTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${trackingId}`);
      setOrder(data.order || data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order not found. Please check your Tracking ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={24} className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle size={24} className="text-blue-500" />;
      case 'processing': return <Package size={24} className="text-purple-500" />;
      case 'shipped': return <Truck size={24} className="text-brand-500" />;
      case 'delivered': return <Home size={24} className="text-green-500" />;
      default: return <CheckCircle size={24} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Track Order</h1>
          <p className="text-slate-500">Enter your order ID to see its current status</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Order ID (e.g., 60d5ecb8b3...)"
              className="input-field pl-10 w-full"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>
      </GlassCard>

      {order && (
        <GlassCard className="p-6">
          <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Order #{order.orderNumber}</h2>
            <p className="text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

            <div className="space-y-8 relative">
              {order.statusHistory?.map((history, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 shadow flex items-center justify-center z-10">
                    {getStatusIcon(history.status)}
                  </div>
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-900 dark:text-white capitalize">{history.status}</h3>
                      <span className="text-sm text-slate-500">
                        {new Date(history.date || order.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{history.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default BuyerOrderTracking;
