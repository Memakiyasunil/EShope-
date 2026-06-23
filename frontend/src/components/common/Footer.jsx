import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import MagneticButton from '../ui/MagneticButton';

const footerLinks = {
  shop: [
    { to: '/categories', label: 'All Products' },
    { to: '/categories?sort=newest', label: 'New Arrivals' },
    { to: '/categories?sort=popular', label: 'Best Sellers' },
    { to: '/categories?discount=true', label: 'Deals & Offers' },
  ],
  company: [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
    { to: '/seller-register', label: 'Become a Partner' },
  ],
  legal: [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-auto relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-brand-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white/10 group-hover:bg-white/20 transition-colors">
                <img src="/logo.png" alt="E-Shop Logo" className="w-full h-full object-contain p-1" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">E-Shop</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-sm">
              The premier digital commerce platform. Experience seamless shopping with cutting-edge technology and world-class design.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 hover:border-transparent transition-all duration-300 hover:-translate-y-1"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-brand-500 transition-all duration-300 group-hover:w-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Column */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe to our newsletter for the latest updates, exclusive deals, and product announcements.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} E-Shop Inc. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
