import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Browse our products, add items to your cart, and proceed to checkout. You will need to create an account or sign in to complete your purchase.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and select digital wallets. All transactions are secured with SSL encryption.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for select items. Free shipping is offered on orders over $50.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return policy for most items. Products must be unused and in original packaging. Contact our support team to initiate a return.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you will receive a tracking number via email. You can also track orders from your dashboard under "My Orders".',
  },
  {
    q: 'How do I become a seller?',
    a: 'Click "Become a Seller" in the footer or visit our seller registration page. Complete the application form and our team will review it within 2-3 business days.',
  },
  {
    q: 'Is my personal information secure?',
    a: 'Yes. We use industry-standard encryption and never share your personal data with third parties without your consent. Read our Privacy Policy for details.',
  },
  {
    q: 'How can I contact customer support?',
    a: 'Reach us via email at support@eshoponline.com, phone at +1 (234) 567-890, or through our Contact page. We respond within 24 hours.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="page-container max-w-3xl">
      <Breadcrumb items={[{ label: 'FAQ', path: '/faq' }]} />

      <div className="text-center mb-12">
        <h1 className="section-title mb-4">Frequently Asked Questions</h1>
        <p className="section-subtitle">
          Find answers to common questions about shopping on E-Shop Online.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="glass-card p-0 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-medium text-slate-900 dark:text-white pr-4">{faq.q}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-fade-in">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
