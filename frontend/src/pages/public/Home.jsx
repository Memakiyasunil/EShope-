import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, Headphones, Tag, Star, Zap, Globe } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Marquee from '../../components/ui/Marquee';
import RevealText from '../../components/ui/RevealText';
import GlassCard from '../../components/ui/GlassCard';
import MagneticButton from '../../components/ui/MagneticButton';
import CountUp from '../../components/ui/CountUp';
import api from '../../utils/axios';

const reviews = [
  { name: "Sarah Jenkins", role: "Design Director", body: "The UI is incredibly fluid. It feels like a premium product from start to finish. Absolutely mind-blowing experience.", rating: 5 },
  { name: "Michael Chang", role: "Tech Entrepreneur", body: "Lightning fast and beautifully designed. This sets a new standard for modern digital commerce platforms.", rating: 5 },
  { name: "Emma Watson", role: "Product Manager", body: "The attention to detail in every interaction is outstanding. A truly world-class shopping experience.", rating: 5 },
  { name: "David Miller", role: "Creative Lead", body: "I'm obsessed with the seamless transitions and glassmorphic elements. It's visually stunning.", rating: 5 },
  { name: "Elena Rodriguez", role: "UX Researcher", body: "Perfect balance of aesthetics and usability. Every micro-interaction feels deliberate and premium.", rating: 5 },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed with global CDN delivery' },
  { icon: Shield, title: 'Bank-Grade Security', desc: 'Enterprise-level encryption for all transactions' },
  { icon: Globe, title: 'Global Reach', desc: 'Seamless shipping to over 150 countries worldwide' },
  { icon: Headphones, title: 'Premium Support', desc: '24/7 priority access to our concierge team' },
];

const stats = [
  { value: 100, suffix: 'K+', label: 'Active Users' },
  { value: 99, suffix: '.9%', label: 'Uptime SLA' },
  { value: 50, suffix: 'M+', label: 'Products Sold' },
  { value: 150, suffix: '+', label: 'Countries Served' },
];

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categorySections, setCategorySections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const { data: catData } = await api.get('/categories');
        const categoriesArray = catData?.categories || [];
        setCategories(categoriesArray);
        
        const topCategories = categoriesArray.slice(0, 4);

        if (topCategories.length > 0) {
          const sectionsData = await Promise.all(
            topCategories.map(async (cat) => {
              try {
                const { data: prodData } = await api.get(`/products?category=${cat._id}&limit=4`);
                const products = Array.isArray(prodData) ? prodData : (Array.isArray(prodData.products) ? prodData.products : (Array.isArray(prodData.data) ? prodData.data : []));
                return { category: cat, products };
              } catch (err) {
                return { category: cat, products: [] };
              }
            })
          );
          setCategorySections(sectionsData.filter(section => section.products.length > 0));
        } else {
          setCategorySections([]);
        }
      } catch {
        setCategorySections([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000" />

        <div className="page-container relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-white/20 shadow-lg"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Introducing E-Shop 2.0</span>
          </motion.div>

          <RevealText 
            text="The Future of Digital Commerce." 
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 justify-center"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 text-balance"
          >
            Experience lightning-fast shopping with our premium, enterprise-grade platform. Beautifully designed for the modern web.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/categories">
              <MagneticButton variant="primary" className="px-8 py-4 text-base rounded-full shadow-brand-500/25 w-full sm:w-auto">
                Explore Products <ArrowRight size={18} />
              </MagneticButton>
            </Link>
            <Link to="/about">
              <MagneticButton variant="secondary" className="px-8 py-4 text-base rounded-full w-full sm:w-auto bg-white/50 backdrop-blur-md">
                View Enterprise
              </MagneticButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative z-20">
        <div className="page-container">
          <GlassCard hoverEffect={false} className="rounded-3xl p-8 md:p-12 border-white/20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200 dark:divide-slate-800">
              {stats.map((stat, i) => (
                <div key={i} className="text-center px-4">
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tighter">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 relative overflow-hidden">
        <div className="page-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
            >
              Engineered for Excellence
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              Every pixel and interaction is carefully crafted to provide an unparalleled user experience.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <GlassCard key={feature.title} className="p-8 group relative overflow-hidden" hoverEffect={true}>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-150 duration-500 pointer-events-none">
                  <feature.icon size={120} />
                </div>
                <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Products Sections */}
      <div className="py-12 bg-slate-100/50 dark:bg-slate-900/20">
        {loading ? (
          <section className="page-container py-12">
            <LoadingSkeleton count={4} />
          </section>
        ) : categorySections.length > 0 ? (
          categorySections.map((section, idx) => (
            <section key={section.category._id} className="page-container py-16">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-end justify-between mb-10"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">{section.category.name}</h2>
                  <p className="text-slate-500 dark:text-slate-400">Curated collection of premium items</p>
                </div>
                <Link to={`/categories?category=${section.category._id}`} className="hidden sm:flex group items-center text-sm font-medium text-brand-600 dark:text-brand-400">
                  View Collection 
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.products.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </section>
          ))
        ) : null}
      </div>

      {/* Testimonials - Marquee */}
      <section className="py-24 relative overflow-hidden">
        <div className="page-container mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            Loved by Industry Leaders
          </motion.h2>
        </div>
        
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:50s]">
            {reviews.map((review, i) => (
              <GlassCard key={i} hoverEffect={false} className="w-[400px] mx-4 p-8 flex flex-col justify-between h-[250px]">
                <div>
                  <div className="flex gap-1 mb-4 text-yellow-400">
                    {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6 font-medium">"{review.body}"</p>
                </div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-white shadow-inner">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.role}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 dark:from-slate-950"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 dark:from-slate-950"></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="page-container">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 py-20 px-8 text-center shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000')] opacity-20 bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to elevate your business?</h2>
              <p className="text-lg text-slate-300 mb-10 text-balance">
                Join thousands of premium sellers leveraging our enterprise platform to scale their commerce operations globally.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/seller-register">
                  <MagneticButton variant="primary" className="w-full sm:w-auto px-8 py-4 rounded-full text-base bg-white text-slate-900 hover:bg-slate-100 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    Become a Partner
                  </MagneticButton>
                </Link>
                <Link to="/contact">
                  <MagneticButton variant="outline" className="w-full sm:w-auto px-8 py-4 rounded-full text-base border-white/30 text-white hover:bg-white/10 hover:border-white">
                    Contact Sales
                  </MagneticButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
