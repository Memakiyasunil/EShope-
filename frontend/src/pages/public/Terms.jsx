import Breadcrumb from '../../components/common/Breadcrumb';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing or using E-Shop Online, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to modify these terms at any time.',
  },
  {
    title: 'Account Registration',
    content: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. Notify us immediately of any unauthorized use.',
  },
  {
    title: 'Products and Pricing',
    content: 'We strive to display accurate product information and pricing. However, errors may occur. We reserve the right to correct errors and cancel orders affected by pricing mistakes. Product availability is subject to change without notice.',
  },
  {
    title: 'Orders and Payment',
    content: 'Placing an order constitutes an offer to purchase. We may accept or decline orders at our discretion. Payment is processed at the time of order. All prices are in USD unless otherwise stated.',
  },
  {
    title: 'Shipping and Delivery',
    content: 'Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery to the carrier. We are not responsible for delays caused by shipping carriers or circumstances beyond our control.',
  },
  {
    title: 'Returns and Refunds',
    content: 'Returns are accepted within 30 days for eligible items in original condition. Refunds are processed within 5-10 business days after we receive the returned item. Shipping costs for returns may apply unless the return is due to our error.',
  },
  {
    title: 'Seller Terms',
    content: 'Sellers must comply with our seller guidelines, provide accurate product listings, and fulfill orders promptly. We reserve the right to suspend or terminate seller accounts that violate our policies.',
  },
  {
    title: 'Limitation of Liability',
    content: 'E-Shop Online is provided "as is" without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of our platform, to the maximum extent permitted by law.',
  },
  {
    title: 'Governing Law',
    content: 'These terms are governed by the laws of the State of California. Any disputes shall be resolved in the courts of San Francisco County, California.',
  },
];

const Terms = () => {
  return (
    <div className="page-container max-w-3xl">
      <Breadcrumb items={[{ label: 'Terms of Service', path: '/terms' }]} />

      <h1 className="section-title mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">
        Last updated: June 1, 2026
      </p>

      <div className="space-y-8">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Welcome to E-Shop Online. Please read these Terms of Service carefully before
          using our website and services.
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

export default Terms;
