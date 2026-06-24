import { useState } from 'react';
import { Star, MessageSquare, Filter, Search, MoreVertical, Reply } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const SellerReviews = () => {
  const [reviews] = useState([
    { 
      id: 1, 
      product: 'Premium Wireless Headphones', 
      customer: 'Alex Johnson', 
      rating: 5, 
      date: '2023-11-20', 
      comment: 'Absolutely love these headphones! The sound quality is incredible and the noise cancellation works perfectly. Would highly recommend.',
      replied: false
    },
    { 
      id: 2, 
      product: 'Minimalist Smart Wallet', 
      customer: 'Samantha Lee', 
      rating: 4, 
      date: '2023-11-18', 
      comment: 'Good quality leather and very slim. The card eject mechanism feels a bit stiff at first but loosens up. Overall a solid purchase.',
      replied: true,
      replyText: 'Thank you for your feedback Samantha! The mechanism is designed to be tight initially to ensure your cards stay secure, and as you noted, it will break in perfectly over time.'
    },
    { 
      id: 3, 
      product: 'Ergonomic Desk Chair', 
      customer: 'David Smith', 
      rating: 2, 
      date: '2023-11-15', 
      comment: 'The chair arrived with a missing screw for the armrest. Customer service was slow to respond. The chair itself is decent but the experience was frustrating.',
      replied: false
    }
  ]);

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customer Reviews</h1>
          <p className="text-slate-500">Monitor and respond to customer feedback</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <GlassCard className="p-6">
          <p className="text-slate-500 text-sm font-medium">Average Rating</p>
          <div className="flex items-end gap-2 mt-1">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">4.8</h3>
            <span className="text-yellow-500 mb-1 flex"><Star size={16} className="fill-yellow-500" /></span>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <p className="text-slate-500 text-sm font-medium">Total Reviews</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">842</h3>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-slate-500 text-sm font-medium">5-Star Rating</p>
          <h3 className="text-3xl font-bold text-green-500 mt-1">92%</h3>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-slate-500 text-sm font-medium">Unanswered</p>
          <h3 className="text-3xl font-bold text-amber-500 mt-1">12</h3>
        </GlassCard>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search reviews by product or customer..."
              className="input-field pl-10 w-full"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} /> Filter Status
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center font-bold">
                    {review.customer.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{review.customer}</h4>
                    <p className="text-sm text-slate-500">on <span className="font-medium text-slate-700 dark:text-slate-300">{review.product}</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-slate-500">{review.date}</span>
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </div>
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 mb-4">{review.comment}</p>
              
              {review.replied ? (
                <div className="ml-14 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-xs font-bold px-2 py-0.5 rounded">Store Response</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{review.replyText}</p>
                </div>
              ) : (
                <div className="ml-14 flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Type your reply to this review..." 
                    className="input-field flex-1 text-sm py-2"
                  />
                  <button className="btn-primary py-2 px-4 flex items-center gap-2 text-sm">
                    <Reply size={14} /> Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default SellerReviews;
