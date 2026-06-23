import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../../store/slices/wishlistSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsInWishlist(product._id));

  const {
    _id,
    name = 'Product',
    price = 0,
    image,
    images,
    rating = 0,
    reviewCount = 0,
    discount,
    stock,
  } = product;

  const productImage = image || images?.[0] || 'https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image';
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  // Use placehold.co as a reliable fallback if picsum is down
  let finalImage = productImage;
  if (finalImage.includes('picsum.photos')) {
    finalImage = `https://placehold.co/600x600/f8fafc/334155?text=${encodeURIComponent(name.split(' ').slice(0, 2).join(' '))}`;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success('Added to cart');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const MotionLink = motion.create(Link);

  return (
    <MotionLink
      to={`/products/${_id}`}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-card p-0 overflow-hidden group flex flex-col h-full animate-fade-in hover:shadow-2xl dark:hover:shadow-slate-800/80"
    >
      <div className="relative overflow-hidden aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <img
          src={finalImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x600/f8fafc/334155?text=${encodeURIComponent(name.split(' ').slice(0, 2).join(' '))}`;
          }}
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {stock === 0 && (
          <span className="absolute top-3 right-3 bg-slate-800/80 text-white text-xs font-medium px-2 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100 ${
            isWishlisted
              ? 'bg-red-500 text-white opacity-100'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-red-500'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-medium text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
              ${discountedPrice.toFixed(2)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-slate-400 line-through">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="p-2 rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </MotionLink>
  );
};

export default ProductCard;
