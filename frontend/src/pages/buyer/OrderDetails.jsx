import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../../utils/axios';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import StatusBadge from '../../components/common/StatusBadge';

const STEPS = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data.order || data.data || data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton variant="card" count={2} />;
  if (!order) return <div className="glass-card text-center py-12">Order not found</div>;

  const currentStep = STEPS.indexOf(order.status);

  return (
    <div>
      <Link to="/customer/orders" className="inline-flex items-center gap-2 text-sm text-brand-600 mb-6 hover:underline">
        <ArrowLeft size={16} /> Back to Orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-title">Order #{order.orderNumber}</h1>
          <p className="text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {!['cancelled', 'returned', 'refunded'].includes(order.status) && (
        <div className="glass-card mb-6">
          <h2 className="font-semibold mb-4">Tracking</h2>
          <div className="flex flex-wrap gap-2">
            {STEPS.map((step, i) => (
              <div key={step} className={`flex items-center gap-1 text-xs capitalize ${i <= currentStep ? 'text-green-600' : 'text-slate-400'}`}>
                <CheckCircle size={14} />
                {step.replace(/_/g, ' ')}
                {i < STEPS.length - 1 && <span className="mx-1 text-slate-300">→</span>}
              </div>
            ))}
          </div>
          {order.trackingNumber && <p className="mt-3 text-sm">Tracking: <strong>{order.trackingNumber}</strong></p>}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card">
          <h2 className="font-semibold mb-4">Items</h2>
          {order.items?.map((item, i) => (
            <div key={i} className="flex gap-3 py-3 border-b border-slate-200 dark:border-slate-700 last:border-0">
              {item.image && <img src={item.image} alt="" className="w-16 h-16 rounded object-cover" />}
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-500">Qty: {item.quantity} · ₹{item.price}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="glass-card">
            <h2 className="font-semibold mb-3">Shipping Address</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.addressLine1}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </p>
          </div>
          <div className="glass-card">
            <h2 className="font-semibold mb-3">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Items</span><span>₹{order.itemsPrice}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>₹{order.taxPrice}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>₹{order.deliveryCharge}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discountAmount}</span></div>}
              <div className="flex justify-between font-bold text-base pt-2 border-t"><span>Total</span><span>₹{order.totalPrice}</span></div>
              <p className="text-slate-500 capitalize">Payment: {order.paymentMethod} · <StatusBadge status={order.paymentStatus} /></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
