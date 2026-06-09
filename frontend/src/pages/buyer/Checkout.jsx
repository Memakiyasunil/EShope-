import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { selectCartItems, selectCartTotal, clearCart } from '../../store/slices/cartSlice';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/axios';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const delivery = subtotal >= 999 ? 0 : 99;
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addressId, setAddressId] = useState(user?.addresses?.[0]?._id || '');
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!items.length) return toast.error('Cart is empty');
    setLoading(true);
    try {
      const orderData = {
        paymentMethod,
        shippingAddress: addressId
          ? undefined
          : user?.addresses?.[0],
        addressId: addressId || undefined,
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };
      const { data } = await api.post('/orders', orderData);
      const order = data.order || data.data;
      if (paymentMethod === 'razorpay' || paymentMethod === 'stripe') {
        await api.post(`/payments/${paymentMethod}/initiate`, { orderId: order._id });
      }
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/dashboard/orders/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return <div className="glass-card text-center py-12">Your cart is empty. <a href="/dashboard/cart" className="text-brand-600">Go to cart</a></div>;
  }

  return (
    <div>
      <h1 className="section-title mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            {user?.addresses?.length ? (
              user.addresses.map((addr) => (
                <label key={addr._id} className="flex gap-3 p-3 rounded-lg border cursor-pointer mb-2 hover:border-brand-500">
                  <input type="radio" name="address" checked={addressId === addr._id} onChange={() => setAddressId(addr._id)} />
                  <div className="text-sm">
                    <p className="font-medium">{addr.fullName}</p>
                    <p className="text-slate-500">{addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}</p>
                  </div>
                </label>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No saved addresses. <a href="/dashboard/addresses" className="text-brand-600">Add one</a></p>
            )}
          </div>
          <div className="glass-card">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            {['cod', 'razorpay', 'stripe'].map((m) => (
              <label key={m} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer mb-2 hover:border-brand-500 capitalize">
                <input type="radio" name="payment" checked={paymentMethod === m} onChange={() => setPaymentMethod(m)} />
                {m === 'cod' ? 'Cash on Delivery' : m}
              </label>
            ))}
          </div>
        </div>
        <div className="glass-card h-fit">
          <h2 className="font-semibold mb-4">Order Summary ({items.length} items)</h2>
          <div className="space-y-2 text-sm mb-6">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{delivery ? `₹${delivery}` : 'Free'}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span><span>₹{(subtotal + delivery).toLocaleString()}</span>
            </div>
          </div>
          <button onClick={placeOrder} disabled={loading} className="btn-primary w-full">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
