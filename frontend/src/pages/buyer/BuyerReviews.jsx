import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const BuyerReviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      product: {
        name: 'Premium Wireless Noise-Cancelling Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
      },
      rating: 5,
      comment: 'Absolutely amazing sound quality! The noise cancellation is the best I have ever experienced. Highly recommend these to anyone who travels frequently.',
      date: '2023-11-15T10:30:00Z',
      status: 'published'
    },
    {
      id: 2,
      product: {
        name: 'Minimalist Leather Smart Wallet',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60'
      },
      rating: 4,
      comment: 'Good quality leather and very compact. The card ejection mechanism works well most of the time, but occasionally gets stuck. Still a great purchase.',
      date: '2023-10-02T14:20:00Z',
      status: 'published'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Reviews</h1>
          <p className="text-slate-500">Manage your product ratings and reviews</p>
        </div>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <GlassCard key={review.id} className="p-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img 
                    src={review.product.image} 
                    alt={review.product.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                      {review.product.name}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full capitalize">
                      {review.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'} 
                      />
                    ))}
                    <span className="text-sm text-slate-500 ml-2">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    "{review.comment}"
                  </p>
                  
                  <div className="pt-2 flex gap-4 text-sm font-medium">
                    <button className="text-brand-600 hover:text-brand-700">Edit Review</button>
                    <button className="text-red-500 hover:text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-full flex items-center justify-center mb-6">
            <MessageSquare size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Reviews Yet</h2>
          <p className="text-slate-500 max-w-md mb-6">
            You haven't reviewed any products yet. Share your experience with other shoppers by reviewing your recent purchases!
          </p>
          <a href="/customer/orders" className="btn-primary">
            Review Past Orders
          </a>
        </GlassCard>
      )}
    </div>
  );
};

export default BuyerReviews;
