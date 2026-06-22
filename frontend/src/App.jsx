import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Ripple from './components/ui/Ripple';
import MorphingText from './components/ui/MorphingText';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Categories from './pages/public/Categories';
import ProductDetails from './pages/public/ProductDetails';
import ShopDetails from './pages/public/ShopDetails';
import FAQ from './pages/public/FAQ';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ResetPassword from './pages/auth/ResetPassword';
import SellerRegister from './pages/auth/SellerRegister';

import BuyerDashboard from './pages/buyer/BuyerDashboard';
import Profile from './pages/buyer/Profile';
import Orders from './pages/buyer/Orders';
import OrderDetails from './pages/buyer/OrderDetails';
import Wishlist from './pages/buyer/Wishlist';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import Addresses from './pages/buyer/Addresses';
import Settings from './pages/buyer/Settings';

import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import AddProduct from './pages/seller/AddProduct';
import SellerOrders from './pages/seller/SellerOrders';
import SellerReports from './pages/seller/SellerReports';
import SellerSettings from './pages/seller/SellerSettings';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBanners from './pages/admin/AdminBanners';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500); // Extended to 4.5 seconds to show off morphing text
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10000] bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-slate-900 dark:text-white overflow-hidden"
          >
            <Ripple />
            <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
              <motion.img 
                src="/logo.png" 
                alt="E-Shop Logo" 
                className="w-32 h-32 md:w-48 md:h-48 object-contain mb-8 drop-shadow-2xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full h-24 relative"
              >
                <MorphingText 
                  texts={["E-Shope", "Shop Smarter", "Live Better", "E-Shope"]} 
                  className="text-4xl md:text-5xl font-extrabold tracking-tight"
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="shops/:id" element={<ShopDetails />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="seller-register" element={<SellerRegister />} />
          <Route path="cart" element={<Cart />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BuyerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="settings" element={<Settings />} />

          <Route path="seller" element={<SellerDashboard />} />
          <Route path="seller/products" element={<SellerProducts />} />
          <Route path="seller/products/add" element={<AddProduct />} />
          <Route path="seller/orders" element={<SellerOrders />} />
          <Route path="seller/reports" element={<SellerReports />} />
          <Route path="seller/settings" element={<SellerSettings />} />

          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/sellers" element={<AdminSellers />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/categories" element={<AdminCategories />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/payments" element={<AdminPayments />} />
          <Route path="admin/coupons" element={<AdminCoupons />} />
          <Route path="admin/banners" element={<AdminBanners />} />
          <Route path="admin/blogs" element={<AdminBlogs />} />
          <Route path="admin/reports" element={<AdminReports />} />
          <Route path="admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
