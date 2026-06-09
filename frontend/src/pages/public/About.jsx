import { Users, Target, Award, Globe } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '10K+', label: 'Products' },
  { value: '500+', label: 'Trusted Sellers' },
  { value: '99%', label: 'Satisfaction Rate' },
];

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To make online shopping accessible, affordable, and enjoyable for everyone.' },
  { icon: Award, title: 'Quality First', desc: 'We partner only with verified sellers who meet our strict quality standards.' },
  { icon: Users, title: 'Customer Focus', desc: 'Your satisfaction drives everything we do, from product selection to support.' },
  { icon: Globe, title: 'Global Reach', desc: 'Connecting buyers and sellers across borders with seamless logistics.' },
];

const About = () => {
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'About Us', path: '/about' }]} />

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="section-title mb-4">About E-Shop Online</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Founded with a vision to revolutionize online shopping, E-Shop Online has grown into
          a trusted marketplace where quality meets affordability. We empower small businesses
          and delight customers with an exceptional shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card text-center">
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{stat.value}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {values.map((item) => (
          <div key={item.title} className="glass-card flex gap-4">
            <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-xl flex items-center justify-center shrink-0">
              <item.icon size={24} className="text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
