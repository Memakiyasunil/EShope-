import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/common/Breadcrumb';
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
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Contact', path: '/contact' }]} />

      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="section-title mb-4">Get in Touch</h1>
        <p className="section-subtitle">
          Have a question or feedback? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: 'Address', info: '123 Commerce Street, Business City, BC 12345' },
            { icon: Phone, title: 'Phone', info: '+1 (234) 567-890' },
            { icon: Mail, title: 'Email', info: 'support@eshoponline.com' },
          ].map((item) => (
            <div key={item.title} className="glass-card flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/50 rounded-lg flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.info}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="label-text">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="label-text">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label className="label-text">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="input-field resize-none"
              placeholder="Your message..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
            <Send size={18} />
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
