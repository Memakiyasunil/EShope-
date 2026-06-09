import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import Breadcrumb from '../../components/common/Breadcrumb';
import SearchBar from '../../components/common/SearchBar';
import api from '../../utils/axios';

const demoProducts = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i + 1),
  name: `Product ${i + 1}`,
  price: 29.99 + i * 10,
  rating: 3.5 + (i % 3) * 0.5,
  reviewCount: 10 + i * 5,
  discount: i % 3 === 0 ? 15 : 0,
  stock: i % 5 === 0 ? 0 : 50,
  image: `https://images.unsplash.com/photo-${1505740420928 + i}?w=400`,
}));

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', {
          params: { page, limit: 12, search, sort, category },
        });
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : (Array.isArray(data.data) ? data.data : []));
        setProducts(productsArray);
        setTotalPages(data.totalPages || data.pagination?.pages || Math.ceil((data.total || data.pagination?.total || 12) / 12));
      } catch {
        setProducts(demoProducts);
        setTotalPages(3);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, search, sort, category]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: 'Shop', path: '/categories' }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">Shop All Products</h1>
          <p className="section-subtitle">Browse our complete collection</p>
        </div>
        <SearchBar
          className="max-w-sm"
          onSearch={(q) => updateParam('search', q)}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-card space-y-6 sticky top-24">
            <h3 className="font-semibold text-slate-900 dark:text-white">Filters</h3>

            <div>
              <label className="label-text">Sort By</label>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest</option>
                <option value="popular">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div>
              <label className="label-text">Category</label>
              <select
                value={category}
                onChange={(e) => updateParam('category', e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports</option>
                <option value="books">Books</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {loading ? 'Loading...' : `Showing ${products.length} products`}
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary text-sm py-2"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {loading ? (
            <LoadingSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="glass-card text-center py-16">
              <p className="text-slate-600 dark:text-slate-400">No products found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => updateParam('page', String(p))}
                className="mt-10"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
