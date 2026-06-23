import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Store, UserCircle, Package, Layers, Award, ShoppingBag, 
  CreditCard, Activity, Tag, Star, FileText, Image, Bell, MessageSquare, 
  BarChart3, Shield, Settings, Database, Lock, X
} from 'lucide-react';
import { setSidebarOpen } from '../../../store/slices/uiSlice';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users Management', icon: Users },
  { to: '/admin/sellers', label: 'Sellers Management', icon: Store },
  { to: '/admin/customers', label: 'Customers Management', icon: UserCircle },
  { to: '/admin/products', label: 'Products Management', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/brands', label: 'Brands', icon: Award },
  { to: '/admin/orders', label: 'Orders Management', icon: ShoppingBag },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/transactions', label: 'Transactions', icon: Activity },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/admin/reviews', label: 'Reviews & Ratings', icon: Star },
  { to: '/admin/cms', label: 'CMS Pages', icon: FileText },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/contact-requests', label: 'Contact Queries', icon: MessageSquare },
  { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { to: '/admin/roles', label: 'Role & Permission', icon: Shield },
  { to: '/admin/settings', label: 'Website Settings', icon: Settings },
  { to: '/admin/system-logs', label: 'System Logs', icon: Database },
  { to: '/admin/security', label: 'Security Settings', icon: Lock },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[300px] glass-panel bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-white/50 dark:border-slate-700/50 transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500 blur-xl opacity-50 rounded-full animate-pulse" />
              <img src="/logo.png" alt="E-Shop Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-2xl relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-purple-600 py-1">E-Shope</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Admin Hub</span>
            </div>
          </div>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden p-2 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors">
            <X size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-110px)] scrollbar-thin">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden"
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="admin-sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-brand-600 via-brand-500 to-purple-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)]"
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

export default AdminSidebar;
