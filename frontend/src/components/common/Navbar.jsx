import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  Store,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import useAuth from '../../hooks/useAuth';
import { selectCartCount } from '../../store/slices/cartSlice';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const location = useLocation();

  const MotionLink = motion.create(Link);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950'
        : 'text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="glass-nav">
      <div className="w-full px-0">
        <div className="flex items-center justify-between h-16">
          <MotionLink 
            to="/" 
            className="flex items-center gap-2 shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <img src="/logo.png" alt="E-Shop Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </motion.div>
            <span className="text-lg font-bold text-slate-900 dark:text-white hidden sm:block">
              E-Shop Online
            </span>
          </MotionLink>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <SearchBar className="w-full" />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>

            <ThemeToggle />

            <Link
              to="/dashboard/wishlist"
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-sm rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4 hidden sm:inline-flex">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <SearchBar autoFocus onSearch={() => setSearchOpen(false)} />
          </div>
        )}
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200/50 dark:border-slate-700/50 animate-slide-up">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn-primary text-center mt-2 sm:hidden"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
