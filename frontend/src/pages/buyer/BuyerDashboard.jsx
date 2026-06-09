import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShoppingBag, Heart, Package, TrendingUp } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import StatsCard from '../../components/common/StatsCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { selectCartCount } from '../../store/slices/cartSlice';
import api from '../../utils/axios';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const [stats, setStats] = useState({ orders: 0, spent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my-orders?limit=100')
      .then(({ data }) => {
        const orders = data.orders || data.data?.orders || [];
        const spent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        setStats({ orders: orders.length, spent });
      })
      .catch(() => setStats({ orders: 0, spent: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton variant="card" count={4} />;

  return (
    <div>
      <h1 className="section-title mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
      <p className="section-subtitle mb-8">Here&apos;s an overview of your account</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Cart Items" value={cartCount} icon={ShoppingBag} color="text-blue-500" />
        <StatsCard label="Wishlist" value={wishlistCount} icon={Heart} color="text-red-500" />
        <StatsCard label="Orders" value={stats.orders} icon={Package} color="text-green-500" />
        <StatsCard label="Total Spent" value={`₹${stats.spent.toLocaleString()}`} icon={TrendingUp} color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/dashboard/cart" className="glass-card hover:shadow-lg transition-shadow text-center py-6">
          <ShoppingBag className="mx-auto mb-2 text-brand-600" size={28} />
          <p className="font-medium">View Cart</p>
        </Link>
        <Link to="/dashboard/orders" className="glass-card hover:shadow-lg transition-shadow text-center py-6">
          <Package className="mx-auto mb-2 text-brand-600" size={28} />
          <p className="font-medium">My Orders</p>
        </Link>
        <Link to="/dashboard/wishlist" className="glass-card hover:shadow-lg transition-shadow text-center py-6">
          <Heart className="mx-auto mb-2 text-brand-600" size={28} />
          <p className="font-medium">Wishlist</p>
        </Link>
      </div>
    </div>
  );
};

export default BuyerDashboard;
