import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import CustomerLayout from './layouts/CustomerLayout';
import SellerLayout from './layouts/SellerLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import SplashScreen from './components/ui/SplashScreen';

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

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import Profile from './pages/buyer/Profile';
import Orders from './pages/buyer/Orders';
import OrderDetails from './pages/buyer/OrderDetails';
import Wishlist from './pages/buyer/Wishlist';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import Addresses from './pages/buyer/Addresses';
import Settings from './pages/buyer/Settings';
import BuyerReviews from './pages/buyer/BuyerReviews';
import BuyerNotifications from './pages/buyer/BuyerNotifications';
import BuyerSupport from './pages/buyer/BuyerSupport';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import SellerOrders from './pages/seller/SellerOrders';
import SellerReports from './pages/seller/SellerReports';
import SellerSettings from './pages/seller/SellerSettings';
import SellerInventory from './pages/seller/SellerInventory';
import SellerSalesAnalytics from './pages/seller/SellerSalesAnalytics';
import SellerCoupons from './pages/seller/SellerCoupons';
import SellerCustomers from './pages/seller/SellerCustomers';
import SellerEarnings from './pages/seller/SellerEarnings';
import SellerNotifications from './pages/seller/SellerNotifications';
import SellerCustomerOrders from './pages/seller/SellerCustomerOrders';
import SellerRevenueReports from './pages/seller/SellerRevenueReports';
import SellerReviews from './pages/seller/SellerReviews';
import SellerWithdrawals from './pages/seller/SellerWithdrawals';
import SellerSupport from './pages/seller/SellerSupport';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSellers from './pages/admin/AdminSellers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminBanners from './pages/admin/AdminBanners';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReviews from './pages/admin/AdminReviews';
import AdminCMS from './pages/admin/AdminCMS';
import AdminContactRequests from './pages/admin/AdminContactRequests';
import AdminRoles from './pages/admin/AdminRoles';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminBrands from './pages/admin/AdminBrands';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminSystemLogs from './pages/admin/AdminSystemLogs';
import AdminSecurity from './pages/admin/AdminSecurity';

// Buyer Pages added directly because they were missing from the list above. Wait, I'll add Buyer additions right above Seller Dashboard
import BuyerEditProfile from './pages/buyer/BuyerEditProfile';
import BuyerOrderTracking from './pages/buyer/BuyerOrderTracking';
import BuyerPaymentMethods from './pages/buyer/BuyerPaymentMethods';
import BuyerReturns from './pages/buyer/BuyerReturns';

import PaymentSuccess from './pages/public/PaymentSuccess';
import PaymentCancel from './pages/public/PaymentCancel';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
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
          <Route path="payment/success" element={<PaymentSuccess />} />
          <Route path="payment/cancel" element={<PaymentCancel />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* CUSTOMER PANEL */}
        <Route path="customer" element={<ProtectedRoute roles={['buyer']}><CustomerLayout /></ProtectedRoute>}>
          <Route index element={<BuyerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="edit-profile" element={<BuyerEditProfile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="order-tracking" element={<BuyerOrderTracking />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="addresses" element={<Addresses />} />
          <Route path="payment-methods" element={<BuyerPaymentMethods />} />
          <Route path="reviews" element={<BuyerReviews />} />
          <Route path="notifications" element={<BuyerNotifications />} />
          <Route path="support" element={<BuyerSupport />} />
          <Route path="returns" element={<BuyerReturns />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* SELLER PANEL */}
        <Route path="seller" element={<ProtectedRoute roles={['seller']}><SellerLayout /></ProtectedRoute>}>
          <Route index element={<SellerDashboard />} />
          <Route path="products" element={<SellerProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="inventory" element={<SellerInventory />} />
          <Route path="orders" element={<SellerOrders />} />
          <Route path="customer-orders" element={<SellerCustomerOrders />} />
          <Route path="analytics" element={<SellerSalesAnalytics />} />
          <Route path="revenue-reports" element={<SellerRevenueReports />} />
          <Route path="coupons" element={<SellerCoupons />} />
          <Route path="settings" element={<SellerSettings />} />
          <Route path="reviews" element={<SellerReviews />} />
          <Route path="notifications" element={<SellerNotifications />} />
          <Route path="withdrawals" element={<SellerWithdrawals />} />
          <Route path="earnings" element={<SellerEarnings />} />
          <Route path="support" element={<SellerSupport />} />
        </Route>

        {/* ADMIN PANEL */}
        <Route path="admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sellers" element={<AdminSellers />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="cms" element={<AdminCMS />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="contact-requests" element={<AdminContactRequests />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="roles" element={<AdminRoles />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="system-logs" element={<AdminSystemLogs />} />
          <Route path="security" element={<AdminSecurity />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
