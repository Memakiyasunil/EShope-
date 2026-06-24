import { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, ChevronDown, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../../components/ui/GlassCard';

const BuyerSupport = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "Where is my order?",
      a: "You can track your order status in real-time by visiting the 'Order Tracking' section in your dashboard and entering your Order ID."
    },
    {
      q: "How do I return an item?",
      a: "Go to the 'Returns & Refunds' section, select the eligible order, and submit a return request. You must do this within 30 days of delivery."
    },
    {
      q: "Can I change my shipping address after placing an order?",
      a: "If your order has not been shipped yet, you can contact our support team immediately to request a change. Once shipped, addresses cannot be changed."
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      return toast.error('Please fill in all fields');
    }

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
          <p className="text-slate-500">We're here to help with any questions or issues</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
            
            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-slate-500 max-w-md mb-6">
                  Thank you for reaching out. Our support team will get back to you within 24 hours.
                </p>
                <button onClick={() => setSuccess(false)} className="btn-primary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">Select a topic</option>
                    <option value="order">Order Inquiry</option>
                    <option value="payment">Payment Issue</option>
                    <option value="account">Account Settings</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-field w-full min-h-[150px] resize-none"
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !subject || !message}
                  className="btn-primary w-full flex justify-center items-center gap-2"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex justify-between items-center p-4 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-medium text-slate-900 dark:text-white">{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && (
                    <div className="p-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-sm border-t border-slate-200 dark:border-slate-700">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6 bg-brand-500 text-white border-transparent">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <Phone size={24} className="text-white" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-white">Call Us Directly</h3>
            <p className="text-brand-100 mb-6 text-sm">
              Available Monday to Friday, 9am - 6pm EST
            </p>
            <p className="text-2xl font-bold tracking-wider text-white">
              1-800-ESHOPE
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Email Support</h3>
            <p className="text-slate-500 mb-4 text-sm">
              Send us an email and we'll reply within 24 hours.
            </p>
            <a href="mailto:support@eshopeonline.com" className="text-brand-600 font-medium hover:underline">
              support@eshopeonline.com
            </a>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default BuyerSupport;
