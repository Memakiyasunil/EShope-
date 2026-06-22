import { Outlet, Link } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative items-center justify-center">
        <div className="max-w-md px-12 text-slate-900 dark:text-white text-center">
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="w-20 h-20">
              <img src="/logo.png" alt="E-Shop Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-bold tracking-tight">E-Shop Online</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
            Shop smarter,<br />live better.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Join thousands of happy customers. Discover amazing products from trusted sellers worldwide.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6 sm:p-8">
          <Link to="/" className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10">
              <img src="/logo.png" alt="E-Shop Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white tracking-tight">E-Shop Online</span>
          </Link>
          <div className="ml-auto flex items-center gap-6">
            <Link to="/" className="hidden lg:flex text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
              Back to Home
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 pb-12">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
