import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Package, TrendingUp, ArrowRight } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import StatsCard from '../../components/common/StatsCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import GlassCard from '../../components/ui/GlassCard';
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 relative"
    >
      <div className="relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Here's an overview of your account and shopping activity.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <StatsCard label="Cart Items" value={cartCount} icon={ShoppingBag} color="text-blue-500" index={0} />
        <StatsCard label="Wishlist" value={wishlistCount} icon={Heart} color="text-red-500" index={1} />
        <StatsCard label="Total Orders" value={stats.orders} icon={Package} color="text-emerald-500" index={2} />
        <StatsCard label="Total Spent" value={`₹${stats.spent.toLocaleString()}`} icon={TrendingUp} color="text-purple-500" index={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Link to="/customer/cart" className="block h-full">
            <GlassCard className="h-full p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-brand-500/20 hover:border-brand-500/50 hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] bg-gradient-to-br from-white/40 to-brand-50/10 dark:from-slate-900/40 dark:to-brand-900/10">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <ShoppingBag size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">View Cart</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                Checkout your items <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </p>
            </GlassCard>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Link to="/customer/orders" className="block h-full">
            <GlassCard className="h-full p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)] bg-gradient-to-br from-white/40 to-emerald-50/10 dark:from-slate-900/40 dark:to-emerald-900/10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">My Orders</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Track and view history <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </p>
            </GlassCard>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Link to="/customer/wishlist" className="block h-full">
            <GlassCard className="h-full p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-rose-500/20 hover:border-rose-500/50 hover:shadow-[0_8px_30px_rgba(244,63,94,0.15)] bg-gradient-to-br from-white/40 to-rose-50/10 dark:from-slate-900/40 dark:to-rose-900/10">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Wishlist</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                View saved favorites <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </p>
            </GlassCard>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BuyerDashboard;
