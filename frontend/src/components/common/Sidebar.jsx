import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Package, ShoppingBag, Heart, Settings, Users,
  BarChart3, Store, X, MapPin, User, CreditCard, Tag, Image,
  FileText, Layers,
} from 'lucide-react';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';

const customerLinks = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
  { to: '/dashboard/orders', label: 'My Orders', icon: ShoppingBag },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/dashboard/cart', label: 'Cart', icon: Package },
  { to: '/dashboard/addresses', label: 'Addresses', icon: MapPin },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const sellerLinks = [
  { to: '/dashboard/seller', label: 'Dashboard', icon: Store },
  { to: '/dashboard/seller/products', label: 'Products', icon: Package },
  { to: '/dashboard/seller/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/dashboard/seller/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/seller/settings', label: 'Shop Settings', icon: Settings },
];

const adminLinks = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/admin/users', label: 'Users', icon: Users },
  { to: '/dashboard/admin/sellers', label: 'Sellers', icon: Store },
  { to: '/dashboard/admin/products', label: 'Products', icon: Package },
  { to: '/dashboard/admin/categories', label: 'Categories', icon: Layers },
  { to: '/dashboard/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/dashboard/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/dashboard/admin/banners', label: 'Banners', icon: Image },
  { to: '/dashboard/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/dashboard/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { isSeller, isAdmin } = useAuth();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-brand-600 text-white'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
    }`;

  const renderLinks = (links) =>
    links.map((link) => (
      <NavLink
        key={link.to}
        to={link.to}
        end={link.to === '/dashboard' || link.to === '/dashboard/seller' || link.to === '/dashboard/admin'}
        className={linkClass}
        onClick={() => dispatch(setSidebarOpen(false))}
      >
        <link.icon size={18} />
        <span>{link.label}</span>
      </NavLink>
    ));

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => dispatch(setSidebarOpen(false))} />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 glass border-r border-slate-200/50 dark:border-slate-700/50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <span className="font-semibold text-slate-900 dark:text-white">E-Shop Online</span>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Buyer</p>
            <div className="space-y-1">{renderLinks(customerLinks)}</div>
          </div>

          {isSeller && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Seller</p>
              <div className="space-y-1">{renderLinks(sellerLinks)}</div>
            </div>
          )}

          {isAdmin && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Admin</p>
              <div className="space-y-1">{renderLinks(adminLinks)}</div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
