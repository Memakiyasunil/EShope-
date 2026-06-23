import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Users, Store, Package, Layers, ShoppingBag, CreditCard, Star, Tag, BarChart3, FileText, MessageSquare, Settings, Shield, X
} from 'lucide-react';
import { setSidebarOpen } from '../../../store/slices/uiSlice';

const adminLinks = [
  { to: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/admin/users', label: 'Users', icon: Users },
  { to: '/dashboard/admin/sellers', label: 'Sellers', icon: Store },
  { to: '/dashboard/admin/products', label: 'Products', icon: Package },
  { to: '/dashboard/admin/categories', label: 'Categories', icon: Layers },
  { to: '/dashboard/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/dashboard/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/dashboard/admin/coupons', label: 'Coupons', icon: Tag },
  { to: '/dashboard/admin/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/admin/cms', label: 'CMS', icon: FileText },
  { to: '/dashboard/admin/contact-requests', label: 'Contact Requests', icon: MessageSquare },
  { to: '/dashboard/admin/settings', label: 'System Settings', icon: Settings },
  { to: '/dashboard/admin/roles', label: 'Roles & Permissions', icon: Shield },
];

const AdminSidebar = () => {
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
        className={`fixed top-0 left-0 z-50 h-full w-64 glass border-r border-slate-200/50 dark:border-slate-700/50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50 h-16">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="E-Shop Logo" className="w-8 h-8 object-contain drop-shadow-sm" />
            <span className="font-semibold text-slate-900 dark:text-white">Admin Hub</span>
          </div>
          <button onClick={() => dispatch(setSidebarOpen(false))} className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={18} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin">
          {adminLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard/admin'}
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

export default AdminSidebar;
