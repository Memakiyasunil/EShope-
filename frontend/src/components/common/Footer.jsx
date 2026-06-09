import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

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
    { to: '/seller-register', label: 'Become a Seller' },
  ],
  legal: [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
                <Store size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">E-Shop Online</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Your trusted online marketplace for quality products at unbeatable prices.
              Shop with confidence and enjoy fast delivery.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-400 hover:text-white transition-colors"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span>123 Commerce Street, Business City, BC 12345</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone size={16} className="shrink-0" />
                <a href="tel:+1234567890" className="hover:text-brand-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={16} className="shrink-0" />
                <a href="mailto:support@eshoponline.com" className="hover:text-brand-400 transition-colors">
                  support@eshoponline.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} E-Shop Online. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-slate-500 hover:text-brand-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
