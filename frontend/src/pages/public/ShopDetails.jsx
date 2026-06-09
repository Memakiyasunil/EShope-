import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Package } from 'lucide-react';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import api from '../../utils/axios';

const demoShop = {
  _id: 's1',
  name: 'TechStore',
  description: 'Your one-stop shop for the latest electronics and gadgets. We offer premium products with excellent customer service and fast shipping.',
  rating: 4.8,
  reviewCount: 342,
  location: 'San Francisco, CA',
  joinedDate: '2022-03-15',
  totalProducts: 156,
  logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
  banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
};

const ShopDetails = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      try {
        const [shopRes, productsRes] = await Promise.all([
          api.get(`/shops/${id}`),
          api.get(`/shops/${id}/products`, { params: { page, limit: 12 } }),
        ]);
        setShop(shopRes.data.shop || shopRes.data?.data || shopRes.data);
        const data = productsRes.data;
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (Array.isArray(data.data) ? data.data : []));
        setProducts(productsArray);
        setTotalPages(data.totalPages || data.pagination?.pages || 1);
      } catch {
        setShop({ ...demoShop, _id: id });
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [id, page]);

  if (loading) {
    return (
      <div>
        <div className="skeleton h-48 md:h-64" />
        <div className="page-container">
          <LoadingSkeleton variant="list" count={1} className="mb-8" />
          <LoadingSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Shop Not Found</h2>
        <Link to="/categories" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={shop.banner} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="page-container">
        <div className="relative -mt-16 mb-8">
          <div className="glass-card flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <img
              src={shop.logo}
              alt={shop.name}
              className="w-24 h-24 rounded-xl object-cover border-4 border-white dark:border-slate-800 shadow-lg"
            />
            <div className="flex-1 pb-2">
              <Breadcrumb
                items={[
                  { label: 'Shops', path: '/categories' },
                  { label: shop.name, path: `/shops/${id}` },
                ]}
              />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{shop.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  {shop.rating} ({shop.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {shop.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Since {new Date(shop.joinedDate).getFullYear()}
                </span>
                <span className="flex items-center gap-1">
                  <Package size={14} /> {shop.totalProducts} products
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-10 leading-relaxed">
          {shop.description}
        </p>

        <h2 className="section-title mb-6">Products from {shop.name}</h2>

        {products.length === 0 ? (
          <div className="glass-card text-center py-16">
            <p className="text-slate-600 dark:text-slate-400">No products available from this shop yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-10"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ShopDetails;
