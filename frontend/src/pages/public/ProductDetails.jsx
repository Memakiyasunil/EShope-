import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, RotateCcw, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/common/Breadcrumb';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ProductCard from '../../components/common/ProductCard';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import api from '../../utils/axios';

const demoProduct = {
  _id: '1',
  name: 'Wireless Headphones Pro',
  price: 79.99,
  rating: 4.5,
  reviewCount: 128,
  discount: 15,
  stock: 50,
  description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals alike.',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600',
  ],
  category: 'Electronics',
  seller: { _id: 's1', name: 'TechStore', rating: 4.8 },
};

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product || data);
        if (data.related) setRelated(data.related);
      } catch {
        setProduct({ ...demoProduct, _id: id });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSkeleton variant="hero" />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton h-96 rounded-xl" />
          <LoadingSkeleton variant="text" count={5} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link to="/categories" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const images = product.images || [product.image];
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    dispatch(addToCart({ product, quantity }));
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  return (
    <div className="page-container">
      <Breadcrumb
        items={[
          { label: 'Shop', path: '/categories' },
          { label: product.name, path: `/products/${id}` },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="glass-card p-0 overflow-hidden mb-4">
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto scrollbar-thin">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-brand-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {product.name}
          </h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-slate-400 line-through">${product.price.toFixed(2)}</span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium px-2 py-0.5 rounded">
                  -{product.discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
            {product.description}
          </p>

          {product.seller && (
            <p className="text-sm mb-6">
              Sold by{' '}
              <Link
                to={`/shops/${product.seller._id}`}
                className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
              >
                {product.seller.name}
              </Link>
            </p>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity:</span>
            <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-lg"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-lg"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-primary flex-1 sm:flex-none">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button
              onClick={() => {
                dispatch(toggleWishlist(product));
                toast.success('Wishlist updated');
              }}
              className="btn-secondary"
            >
              <Heart size={18} /> Wishlist
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Truck, text: 'Free Shipping' },
              { icon: RotateCcw, text: '30-Day Returns' },
              { icon: Shield, text: 'Secure Payment' },
            ].map((item) => (
              <div key={item.text} className="text-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <item.icon size={20} className="mx-auto text-brand-600 dark:text-brand-400 mb-1" />
                <p className="text-xs text-slate-600 dark:text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
