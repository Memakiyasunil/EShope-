import { motion } from 'framer-motion';
import { Users, Target, Award, Globe, Building, Zap, Heart } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import CountUp from '../../components/ui/CountUp';
import GlassCard from '../../components/ui/GlassCard';
import RevealText from '../../components/ui/RevealText';

const stats = [
  { value: 50, suffix: 'K+', label: 'Happy Customers' },
  { value: 10, suffix: 'K+', label: 'Products Available' },
  { value: 500, suffix: '+', label: 'Trusted Sellers' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
];

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To democratize digital commerce by providing accessible, cutting-edge tools for sellers and an unmatched shopping experience for buyers.' },
  { icon: Award, title: 'Quality First', desc: 'We maintain stringent quality standards, partnering exclusively with verified merchants who share our commitment to excellence.' },
  { icon: Heart, title: 'Customer Obsession', desc: 'Every decision we make starts with the customer and works backwards. Your satisfaction is our true north.' },
  { icon: Globe, title: 'Global Infrastructure', desc: 'Our platform is powered by a globally distributed network, ensuring lightning-fast performance anywhere in the world.' },
];

const timeline = [
  { year: '2023', title: 'The Inception', desc: 'E-Shop was founded with a vision to build the ultimate modern commerce platform.' },
  { year: '2024', title: 'Rapid Expansion', desc: 'Reached our first 10,000 active sellers and expanded operations globally.' },
  { year: '2025', title: 'Enterprise Solutions', desc: 'Launched our B2B SaaS offerings, empowering large-scale merchants.' },
  { year: '2026', title: 'E-Shop 2.0', desc: 'Completely reimagined the user experience with cutting-edge web technologies.' },
];

const About = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-100/50 to-transparent dark:from-brand-900/20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-brand-400/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="page-container relative z-10">
          <Breadcrumb items={[{ label: 'About Us', path: '/about' }]} />

          <div className="max-w-4xl mx-auto text-center mt-12 mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-wide uppercase"
            >
              <Building size={16} /> Our Story
            </motion.div>
            
            <RevealText 
              text="Redefining Digital Commerce." 
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 justify-center"
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed text-balance"
            >
              Founded with a vision to revolutionize online shopping, E-Shop Online has grown into a trusted enterprise marketplace. We empower small businesses and delight customers with an exceptional, world-class digital experience.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="page-container relative z-20 -mt-10">
        <GlassCard hoverEffect={false} className="rounded-3xl p-8 border-white/40 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200/50 dark:divide-slate-800/50">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-bold text-brand-600 dark:text-brand-400 mb-2 tracking-tighter">
                  <CountUp end={stat.value} suffix={stat.suffix} duration={2} />
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Core Principles</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">The foundational values that drive our engineering, design, and business decisions every single day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="flex flex-col sm:flex-row gap-6 p-8 h-full" hoverEffect={true}>
                  <div className="w-14 h-14 bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-950 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                    <item.icon size={28} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="page-container max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Our Journey</h2>
          </div>

          <div className="relative border-l-2 border-brand-200 dark:border-brand-800 ml-4 md:ml-1/2">
            {timeline.map((item, i) => (
              <motion.div 
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="mb-12 ml-8 relative"
              >
                <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-brand-500 border-4 border-white dark:border-slate-950" />
                <div className="glass-panel p-6 rounded-2xl">
                  <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider text-sm mb-2 block">{item.year}</span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
