import { Menu, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../store/slices/uiSlice';
import useAuth from '../../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const dispatch = useDispatch();
  const { user, signOut } = useAuth();

  return (
    <header className="h-[90px] border-b border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl flex items-center justify-between px-6 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-colors shadow-sm"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-slate-700 dark:text-slate-200" />
        </button>
        <Link to="/" className="text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hidden lg:flex items-center gap-2 group transition-colors px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20">
          <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Store
        </Link>
      </div>

      <div className="flex items-center gap-5">
        <ThemeToggle />
        
        <div className="flex items-center gap-4 border-l border-white/30 dark:border-slate-700/50 pl-5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1.5">{user?.name}</p>
            <p className="text-[10px] font-bold text-brand-600 dark:text-brand-400 leading-none uppercase tracking-wider">{user?.role}</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 via-brand-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg relative z-10 border border-white/20 transform group-hover:scale-105 transition-all">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <button 
            onClick={signOut}
            className="p-2.5 text-slate-400 hover:text-red-500 bg-white/50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-xl transition-all duration-300 ml-2 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
