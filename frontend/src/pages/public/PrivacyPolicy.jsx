import Breadcrumb from '../../components/common/Breadcrumb';

const sections = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly, such as your name, email address, shipping address, and payment details when you create an account or make a purchase. We also collect usage data including browsing history, device information, and cookies to improve your experience.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information is used to process orders, provide customer support, send order updates, personalize your shopping experience, and improve our services. We may also send promotional emails if you have opted in, which you can unsubscribe from at any time.',
  },
  {
    title: 'Information Sharing',
    content: 'We do not sell your personal information. We share data only with trusted service providers (payment processors, shipping partners) necessary to fulfill your orders, and when required by law. Sellers receive only the information needed to process your orders.',
  },
  {
    title: 'Data Security',
    content: 'We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, update, or delete your personal information. You can manage your account settings or contact us to exercise these rights. Residents of certain jurisdictions may have additional rights under applicable privacy laws.',
  },
  {
    title: 'Cookies',
    content: 'We use cookies and similar technologies to remember your preferences, keep you signed in, and analyze site traffic. You can control cookie settings through your browser, though some features may not function properly if cookies are disabled.',
  },
  {
    title: 'Contact Us',
    content: 'If you have questions about this Privacy Policy, please contact us at privacy@eshoponline.com or through our Contact page.',
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="page-container max-w-3xl">
      <Breadcrumb items={[{ label: 'Privacy Policy', path: '/privacy-policy' }]} />

      <h1 className="section-title mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">
        Last updated: June 1, 2026
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          E-Shop Online ("we", "our", or "us") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and safeguard your information
          when you use our website and services.
        </p>

        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
              {section.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
