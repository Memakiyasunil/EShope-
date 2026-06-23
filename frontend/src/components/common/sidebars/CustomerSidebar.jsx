import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, User, UserCog, ShoppingBag, Truck, Heart, 
  ShoppingCart, CreditCard, MapPin, Wallet, Star, Bell, 
  LifeBuoy, RefreshCcw, Settings, X
} from 'lucide-react';
import { setSidebarOpen } from '../../../store/slices/uiSlice';

const customerLinks = [
  { to: '/customer', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/customer/profile', label: 'My Profile', icon: User },
  { to: '/customer/edit-profile', label: 'Edit Profile', icon: UserCog },
  { to: '/customer/orders', label: 'My Orders', icon: ShoppingBag },
  { to: '/customer/order-tracking', label: 'Order Tracking', icon: Truck },
  { to: '/customer/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/customer/cart', label: 'Shopping Cart', icon: ShoppingCart },
  { to: '/customer/checkout', label: 'Checkout', icon: CreditCard },
  { to: '/customer/addresses', label: 'Saved Addresses', icon: MapPin },
  { to: '/customer/payment-methods', label: 'Payment Methods', icon: Wallet },
  { to: '/customer/reviews', label: 'Reviews & Ratings', icon: Star },
  { to: '/customer/notifications', label: 'Notifications', icon: Bell },
  { to: '/customer/support', label: 'Support Tickets', icon: LifeBuoy },
  { to: '/customer/returns', label: 'Returns & Refunds', icon: RefreshCcw },
  { to: '/customer/settings', label: 'Account Settings', icon: Settings },
];

const CustomerSidebar = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[280px] glass-panel bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-white/50 dark:border-slate-700/50 transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-800/50 h-[90px]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 blur-xl opacity-50 rounded-full animate-pulse" />
              <img src="/logo.png" alt="E-Shop Logo" className="w-12 h-12 object-contain drop-shadow-2xl relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600">E-Shope</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Customer</span>
            </div>
          </div>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors">
            <X size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-90px)] scrollbar-thin">
          {customerLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/customer'}
              className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden"
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="customer-sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-blue-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div className={`relative z-10 flex items-center gap-3 w-full transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-white'}`}>
                    <link.icon size={20} className={`transition-all duration-300 ${!isActive && 'group-hover:scale-110 group-hover:text-brand-500 dark:group-hover:text-brand-400'}`} />
                    <span className={`transition-transform duration-300 ${!isActive && 'group-hover:translate-x-1'}`}>{link.label}</span>
                  </div>
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default CustomerSidebar;
