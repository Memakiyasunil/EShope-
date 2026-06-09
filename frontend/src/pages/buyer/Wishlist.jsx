import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { removeFromWishlist, setWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import api from '../../utils/axios';

const Wishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);
  const loading = useSelector((state) => state.wishlist.loading);

  useEffect(() => {
    api.get('/wishlist')
      .then(({ data }) => {
        const list = data.wishlist?.products || data.products || data.data?.products || [];
        dispatch(setWishlist(list));
      })
      .catch(() => {});
  }, [dispatch]);

  const handleRemove = async (productId) => {
    dispatch(removeFromWishlist(productId));
    try { await api.delete(`/wishlist/${productId}`); } catch { /* local only */ }
    toast.success('Removed from wishlist');
  };

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    handleRemove(product._id);
    toast.success('Moved to cart');
  };

  if (loading) return <LoadingSkeleton variant="card" count={4} />;

  return (
    <div>
      <h1 className="section-title mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="glass-card text-center py-12">
          <Heart className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500 mb-4">Your wishlist is empty</p>
          <Link to="/categories" className="btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div key={product._id} className="relative">
              <ProductCard product={product} />
              <div className="flex gap-2 mt-2">
                <button onClick={() => handleMoveToCart(product)} className="btn-primary flex-1 text-sm py-2">
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button onClick={() => handleRemove(product._id)} className="btn-outline text-sm py-2 px-3">
                  <Heart size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
