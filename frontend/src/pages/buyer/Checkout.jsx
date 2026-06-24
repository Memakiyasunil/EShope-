import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Plus, Save, X } from 'lucide-react';
import { selectCartItems, selectCartTotal, clearCart } from '../../store/slices/cartSlice';
import useAuth from '../../hooks/useAuth';
import api from '../../utils/axios';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, refreshUser } = useAuth();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const delivery = subtotal >= 999 ? 0 : 99;
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [addressId, setAddressId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
  });

  // Set default address if available
  useEffect(() => {
    if (user?.addresses?.length > 0 && !addressId) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setAddressId(defaultAddr._id);
    }
  }, [user, addressId]);

  // If no addresses, force add address
  useEffect(() => {
    if (user && (!user.addresses || user.addresses.length === 0)) {
      setIsAddingAddress(true);
    }
  }, [user]);

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    setAddressLoading(true);
    try {
      const { data } = await api.post('/users/addresses', addressForm);
      toast.success('Address saved successfully');
      await refreshUser();
      
      // Auto-select the newly added address (the last one in the array)
      const newAddresses = data.addresses || data.data?.addresses;
      if (newAddresses && newAddresses.length > 0) {
        setAddressId(newAddresses[newAddresses.length - 1]._id);
      }
      
      setIsAddingAddress(false);
      setAddressForm({
        fullName: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setAddressLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    if (!items.length) return toast.error('Cart is empty');
    if (!addressId) return toast.error('Please select a delivery address');
    
    setLoading(true);
    try {
      const orderData = {
        paymentMethod,
        shippingAddress: user.addresses.find(a => a._id === addressId),
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      };
      
      // 1. Create the Order
      const { data } = await api.post('/orders', orderData);
      const order = data.order || data.data;
      
      // 2. Initiate Payment
      if (paymentMethod === 'razorpay') {
        try {
          const res = await api.post(`/payments/${order._id}/initiate`, { method: 'razorpay' });
          const { razorpayOrder } = res.data.data || res.data;
          
          const scriptLoaded = await loadRazorpayScript();
          if (!scriptLoaded) {
            toast.error('Failed to load Razorpay SDK');
            return navigate('/customer/orders');
          }

          const options = {
            key: razorpayOrder.key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: 'E-Shop Online',
            description: `Order ${order.orderNumber}`,
            order_id: razorpayOrder.id,
            handler: async function (response) {
              try {
                await api.post('/payments/verify/razorpay', {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                dispatch(clearCart());
                navigate('/payment/success');
              } catch (err) {
                toast.error('Payment verification failed');
                navigate('/payment/cancel');
              }
            },
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.phone || '',
            },
            theme: { color: '#0ea5e9' }
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function () {
            toast.error('Payment Failed');
            navigate('/payment/cancel');
          });
          rzp.open();
        } catch (err) {
          if (err.response?.status === 503) {
            toast.error('Razorpay keys not configured. Please use COD or add keys to backend/.env');
            navigate('/customer/orders');
          } else {
            throw err;
          }
        }
      } else if (paymentMethod === 'stripe') {
        try {
          const res = await api.post(`/payments/${order._id}/initiate`, { method: 'stripe' });
          const { sessionUrl } = res.data.data || res.data;
          dispatch(clearCart());
          window.location.href = sessionUrl;
        } catch (err) {
          if (err.response?.status === 503) {
            toast.error('Stripe keys not configured. Please use COD or add keys to backend/.env');
            navigate('/customer/orders');
          } else {
            throw err;
          }
        }
      } else {
        // Cash on Delivery
        await api.post(`/payments/${order._id}/initiate`, { method: 'cod' });
        dispatch(clearCart());
        toast.success('Order placed successfully!');
        navigate('/customer/orders');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="glass-card text-center py-16">
        <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/categories" className="btn-primary inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Delivery Address</h2>
              {!isAddingAddress && (
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <Plus size={16} /> Add New
                </button>
              )}
            </div>

            {isAddingAddress ? (
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Add New Address</h3>
                  {user?.addresses?.length > 0 && (
                    <button onClick={() => setIsAddingAddress(false)} className="text-slate-400 hover:text-slate-600">
                      <X size={20} />
                    </button>
                  )}
                </div>
                <form onSubmit={saveAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input required type="text" name="fullName" value={addressForm.fullName} onChange={handleAddressChange} className="input-field w-full" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input required type="text" name="phone" value={addressForm.phone} onChange={handleAddressChange} className="input-field w-full" placeholder="+1 234 567 890" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <input required type="text" name="addressLine1" value={addressForm.addressLine1} onChange={handleAddressChange} className="input-field w-full" placeholder="123 Main St, Apt 4B" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input required type="text" name="city" value={addressForm.city} onChange={handleAddressChange} className="input-field w-full" placeholder="New York" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input required type="text" name="state" value={addressForm.state} onChange={handleAddressChange} className="input-field w-full" placeholder="NY" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input required type="text" name="postalCode" value={addressForm.postalCode} onChange={handleAddressChange} className="input-field w-full" placeholder="10001" />
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button type="submit" disabled={addressLoading} className="btn-primary w-full flex justify-center items-center gap-2">
                      <Save size={18} />
                      {addressLoading ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-3">
                {user?.addresses?.map((addr) => (
                  <label 
                    key={addr._id} 
                    className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      addressId === addr._id 
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="address" 
                      className="mt-1 w-4 h-4 text-brand-600 focus:ring-brand-500"
                      checked={addressId === addr._id} 
                      onChange={() => setAddressId(addr._id)} 
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{addr.fullName}</p>
                        {addr.isDefault && (
                          <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-medium">Default</span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{addr.addressLine1}, {addr.city}</p>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{addr.state} {addr.postalCode}</p>
                      <p className="text-slate-500 text-sm font-medium mt-2 flex items-center gap-2">
                        📞 {addr.phone}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="glass-card">
            <h2 className="text-lg font-bold mb-6">Payment Method</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                { id: 'stripe', label: 'Credit Card', icon: '💳' },
                { id: 'razorpay', label: 'Razorpay', icon: '⚡' }
              ].map((m) => (
                <label 
                  key={m.id} 
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                    paymentMethod === m.id 
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'
                  }`}
                >
                  <input type="radio" name="payment" className="sr-only" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} />
                  <span className="text-2xl">{m.icon}</span>
                  <span className="font-medium text-sm text-slate-900 dark:text-white">{m.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card sticky top-28">
            <h2 className="font-bold text-lg mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Items ({items.length})</span>
                <span className="font-medium text-slate-900 dark:text-white">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Delivery Charge</span>
                <span className="font-medium text-slate-900 dark:text-white">{delivery ? `₹${delivery}` : <span className="text-green-600">Free</span>}</span>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center text-lg font-bold text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-brand-600 dark:text-brand-400">₹{(subtotal + delivery).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={placeOrder} 
              disabled={loading || isAddingAddress || (!addressId && user?.addresses?.length > 0)} 
              className="btn-primary w-full py-3.5 text-base shadow-[0_4px_14px_rgba(0,112,243,0.3)]"
            >
              {loading ? 'Processing Order...' : 'Place Order'}
            </button>
            
            {isAddingAddress && (
              <p className="text-center text-sm text-red-500 mt-3 font-medium">
                Please save your address first
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
