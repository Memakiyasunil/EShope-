import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, Tag } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Marquee from '../../components/ui/Marquee';
import api from '../../utils/axios';

const reviews = [
  { name: "John Doe", handle: "@johndoe", body: "I've never seen anything like this before. It's amazing. I love it." },
  { name: "Jane Smith", handle: "@janesmith", body: "I don't know what to say. I'm speechless. This is fantastic." },
  { name: "Mike Johnson", handle: "@mikej", body: "I'm at a loss for words. This is amazing. I love it." },
  { name: "Emily Davis", handle: "@emilyd", body: "Incredible shopping experience. The deals are unbeatable!" },
  { name: "Chris Wilson", handle: "@chrisw", body: "Fast shipping and great customer support. Highly recommended." },
];

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected checkout' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer service' },
  { icon: Tag, title: 'Best Deals', desc: 'Exclusive discounts daily' },
];

const demoProducts = [
  { _id: '1', name: 'Wireless Headphones', price: 79.99, rating: 4.5, reviewCount: 128, discount: 15, stock: 50, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { _id: '2', name: 'Smart Watch Pro', price: 199.99, rating: 4.8, reviewCount: 256, discount: 0, stock: 30, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { _id: '3', name: 'Leather Backpack', price: 59.99, rating: 4.3, reviewCount: 89, discount: 20, stock: 45, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { _id: '4', name: 'Running Shoes', price: 89.99, rating: 4.6, reviewCount: 312, discount: 10, stock: 60, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?limit=8');
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (Array.isArray(data.data) ? data.data : []));
        setProducts(productsArray.length > 0 ? productsArray : demoProducts);
      } catch {
        setProducts(demoProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="page-container relative z-10 py-20 md:py-28">
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover Amazing Deals at E-Shop Online
            </h1>
            <p className="text-lg md:text-xl text-brand-100 mb-8">
              Shop the latest trends in electronics, fashion, home & more. Quality products, unbeatable prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/categories" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 text-base px-8 py-3">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-outline border-white text-white hover:bg-white/10 text-base px-8 py-3">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-container -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="glass-card text-center py-6">
              <feature.icon size={28} className="mx-auto text-brand-600 dark:text-brand-400 mb-3" />
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{feature.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked items just for you</p>
          </div>
          <Link to="/categories" className="btn-outline hidden sm:inline-flex">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link to="/categories" className="btn-primary">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="py-16 overflow-hidden bg-slate-50 dark:bg-slate-900/50">
        <div className="page-container mb-10 text-center">
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real feedback from verified buyers</p>
        </div>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:40s]">
            {reviews.map((review, i) => (
              <div key={i} className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-950 w-[350px] shadow-sm mx-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.handle}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">"{review.body}"</p>
              </div>
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 dark:from-slate-950"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 dark:from-slate-950"></div>
        </div>
      </section>

      <section className="bg-slate-100 dark:bg-slate-800/50 py-16">
        <div className="page-container text-center">
          <h2 className="section-title mb-4">Ready to Start Selling?</h2>
          <p className="section-subtitle max-w-lg mx-auto mb-8">
            Join our marketplace and reach millions of customers. Easy setup, powerful tools, and dedicated support.
          </p>
          <Link to="/seller-register" className="btn-primary text-base px-8 py-3">
            Become a Seller <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
