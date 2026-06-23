import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateQuantity, removeFromCart, selectCartItems, selectCartTotal } from '../../store/slices/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ productId: id, quantity: qty }));
  };

  const remove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed');
  };

  if (items.length === 0) {
    return (
      <div className="glass-card text-center py-16">
        <ShoppingBag className="mx-auto mb-4 text-slate-300" size={56} />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <Link to="/categories" className="btn-primary mt-4">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="section-title mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const price = item.discount
              ? Math.round(item.price - (item.price * item.discount) / 100)
              : item.price;
            return (
              <div key={item._id} className="glass-card flex gap-4">
                <img src={item.images?.[0] || item.image} alt="" className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-brand-600 font-bold mt-1">₹{price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => updateQty(item._id, item.quantity - 1)} className="p-1 rounded border"><Minus size={16} /></button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item._id, item.quantity + 1)} className="p-1 rounded border"><Plus size={16} /></button>
                    <button onClick={() => remove(item._id)} className="ml-auto text-red-500 p-1"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="glass-card h-fit">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{total >= 999 ? 'Free' : '₹99'}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span><span>₹{(total + (total >= 999 ? 0 : 99)).toLocaleString()}</span>
            </div>
          </div>
          <Link to="/customer/checkout" className="btn-primary w-full text-center">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
