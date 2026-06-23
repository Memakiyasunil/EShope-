import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Package, PlusCircle, Edit, Box, ShoppingBag, 
  Users, BarChart3, TrendingUp, Tag, Settings, Star, 
  Bell, HandCoins, Wallet, LifeBuoy, X
} from 'lucide-react';
import { setSidebarOpen } from '../../../store/slices/uiSlice';

const sellerLinks = [
  { to: '/seller', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/seller/products', label: 'Product Management', icon: Package },
  { to: '/seller/products/add', label: 'Add Product', icon: PlusCircle },
  { to: '/seller/products/edit', label: 'Edit Product', icon: Edit },
  { to: '/seller/inventory', label: 'Inventory Management', icon: Box },
  { to: '/seller/orders', label: 'Orders Management', icon: ShoppingBag },
  { to: '/seller/customer-orders', label: 'Customer Orders', icon: Users },
  { to: '/seller/analytics', label: 'Sales Analytics', icon: BarChart3 },
  { to: '/seller/revenue-reports', label: 'Revenue Reports', icon: TrendingUp },
  { to: '/seller/coupons', label: 'Coupons', icon: Tag },
  { to: '/seller/settings', label: 'Shop Settings', icon: Settings },
  { to: '/seller/reviews', label: 'Customer Reviews', icon: Star },
  { to: '/seller/notifications', label: 'Notifications', icon: Bell },
  { to: '/seller/withdrawals', label: 'Withdrawal Requests', icon: HandCoins },
  { to: '/seller/earnings', label: 'Earnings', icon: Wallet },
  { to: '/seller/support', label: 'Support', icon: LifeBuoy },
];

const SellerSidebar = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-600 text-white'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
    }`;

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 glass border-r border-slate-200/50 dark:border-slate-700/50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50 h-16">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="E-Shop Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="font-semibold text-slate-900 dark:text-white">Seller Hub</span>
          </div>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin">
          {sellerLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/seller'}
              className={linkClass}
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default SellerSidebar;
