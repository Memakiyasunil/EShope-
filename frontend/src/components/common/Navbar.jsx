import { useState, useEffect } from 'react';
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
  ChevronDown,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import useAuth from '../../hooks/useAuth';
import { selectCartCount } from '../../store/slices/cartSlice';
import api from '../../utils/axios';
import useRoleCheck from '../../hooks/useRoleCheck';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Shop', hasMegaMenu: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [navCategories, setNavCategories] = useState([]);

  const { isAuthenticated, user, signOut } = useAuth();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const location = useLocation();
  const { checkRole, RoleModal } = useRoleCheck();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // Fetch categories for mega menu
    api.get('/categories')
      .then(({ data }) => setNavCategories(data?.categories || data?.data || []))
      .catch(() => setNavCategories([]));
      
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const MotionLink = motion.create(Link);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled
        ? 'bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border-slate-200/50 dark:border-slate-800/50 py-3'
        : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <MotionLink
            to="/"
            className="flex items-center gap-3 shrink-0 group transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center overflow-visible transition-transform duration-500 group-hover:drop-shadow-[0_0_12px_rgba(0,112,243,0.3)] dark:group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 hidden sm:block tracking-tighter transition-all duration-300 group-hover:opacity-90 py-1">
              E-Shope
            </span>
          </MotionLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 bg-slate-100/40 dark:bg-slate-800/40 p-1.5 rounded-full backdrop-blur-md border border-white/20 dark:border-slate-700/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500 hover:bg-slate-100/60 dark:hover:bg-slate-800/60">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <div
                  key={link.to}
                  className="relative"
                  onMouseEnter={() => link.hasMegaMenu && setHoveredMenu(link.label)}
                  onMouseLeave={() => link.hasMegaMenu && setHoveredMenu(null)}
                >
                  <Link
                    to={link.to}
                    className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 group/link ${isActive
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    {isActive ? (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-white dark:bg-slate-700/80 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-slate-200/50 dark:border-slate-600/50"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-200/0 dark:bg-slate-700/0 rounded-full transition-all duration-300 group-hover/link:bg-slate-200/50 dark:group-hover/link:bg-slate-700/50" />
                    )}
                    <span className="relative z-10">{link.label}</span>
                    {link.hasMegaMenu && <ChevronDown size={14} className="relative z-10 opacity-50" />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {link.hasMegaMenu && (
                    <AnimatePresence>
                      {hoveredMenu === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px]"
                        >
                          <div className="glass-panel rounded-2xl p-6 grid grid-cols-2 gap-6 shadow-2xl">
                            <div>
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Categories</h3>
                              <ul className="space-y-2">
                                {navCategories.slice(0, 6).map(cat => (
                                  <li key={cat._id}>
                                    <Link to={`/categories?category=${cat._id}`} className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:translate-x-1 transition-transform block">
                                      {cat.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex flex-col justify-between">
                              <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Featured Collection</h3>
                                <p className="text-xs text-slate-500 mb-4">Discover our latest premium products with exclusive discounts.</p>
                              </div>
                              <Link to="/categories?featured=true" className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:underline">
                                Shop Now &rarr;
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 transition-all duration-300">
            <SearchBar className="w-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] rounded-full transition-all duration-500 focus-within:ring-2 focus-within:ring-brand-500/50 focus-within:shadow-[0_0_15px_rgba(0,112,243,0.15)] dark:focus-within:shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 active:scale-95"
            >
              <Search size={22} />
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">
                <ThemeToggle />
              </div>

              <Link
                to="/customer/wishlist"
                onClick={checkRole}
                className="relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300 group hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              >
                <Heart size={22} className="group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_5px_rgba(239,68,68,0.4)] border border-white dark:border-slate-900"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-300 group hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(0,112,243,0.3)] dark:hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              >
                <ShoppingCart size={22} className="group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-brand-600 dark:bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_5px_rgba(0,112,243,0.4)] border border-white dark:border-slate-900"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative group ml-2">
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm group-hover:shadow-[0_0_12px_rgba(0,112,243,0.4)] transition-all duration-300 group-hover:scale-105">
                    <span className="text-sm font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-3 w-56 glass-panel rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to={user?.role === 'admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/customer'}
                        className="block px-4 py-2.5 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Dashboard
                      </Link>
                      {(!user?.role || user?.role === 'buyer') && (
                        <>
                          <Link
                            to="/customer/orders"
                            className="block px-4 py-2.5 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-1"
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/customer/order-tracking"
                            className="block px-4 py-2.5 text-sm font-medium rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-1"
                          >
                            Track Order
                          </Link>
                        </>
                      )}
                      <button
                        onClick={signOut}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm font-semibold py-2.5 px-6 hidden sm:inline-flex ml-2 rounded-full shadow-[0_4px_12px_rgba(0,112,243,0.3)] hover:shadow-[0_6px_16px_rgba(0,112,243,0.4)] transition-all duration-300 hover:-translate-y-0.5">
                  Sign In
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 ml-1 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 active:scale-95"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 pt-2">
                <SearchBar autoFocus onSearch={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <RoleModal />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full glass-panel border-t border-slate-200/50 dark:border-slate-800/50 shadow-xl"
          >
            <nav className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-brand-50 text-brand-600 dark:bg-slate-800 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 mt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  <Link
                    to="/login"
                    className="btn-primary w-full justify-center rounded-xl py-3"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
