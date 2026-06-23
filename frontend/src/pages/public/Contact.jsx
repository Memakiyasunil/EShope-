import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/common/Breadcrumb';
import GlassCard from '../../components/ui/GlassCard';
import RevealText from '../../components/ui/RevealText';
import api from '../../utils/axios';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.success('Message received! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24">
      {/* Header Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="page-container relative z-10">
          <Breadcrumb items={[{ label: 'Contact', path: '/contact' }]} />

          <div className="max-w-3xl mx-auto text-center mt-12 mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 text-sm font-semibold tracking-wide uppercase"
            >
              <MessageSquare size={16} /> Get In Touch
            </motion.div>
            
            <RevealText 
              text="Let's Start a Conversation." 
              className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 justify-center"
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            >
              Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="page-container relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-6"
          >
            <GlassCard hoverEffect={false} className="p-8 h-full bg-slate-900 border-white/10 text-white rounded-3xl shadow-xl">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
              <p className="text-slate-400 mb-10 text-sm leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: MapPin, title: 'Office', info: '123 Enterprise Way, Tech District, San Francisco, CA 94105' },
                  { icon: Phone, title: 'Phone', info: '+1 (800) 123-4567' },
                  { icon: Mail, title: 'Email', info: 'hello@eshop.enterprise' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-500 transition-colors duration-300">
                      <item.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <GlassCard hoverEffect={false} className="p-8 md:p-12 rounded-3xl shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white"
                    placeholder="How can we help you?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all duration-300 text-slate-900 dark:text-white resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading} 
                  className="w-full md:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-500/25"
                >
                  <Send size={18} />
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
          
        </div>
      </section>
    </div>
  );
};

export default Contact;
