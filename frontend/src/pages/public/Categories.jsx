import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Laptop, Shirt, Home as HomeIcon, Dumbbell, Book, ShoppingBag, Coffee, ArrowLeft } from 'lucide-react';
import ProductCard from '../../components/common/ProductCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Pagination from '../../components/common/Pagination';
import api from '../../utils/axios';

const demoProducts = Array.from({ length: 12 }, (_, i) => ({
  _id: String(i + 1),
  name: `Product ${i + 1}`,
  price: 29.99 + i * 10,
  rating: 3.5 + (i % 3) * 0.5,
  reviewCount: 10 + i * 5,
  discount: i % 3 === 0 ? 15 : 0,
  stock: i % 5 === 0 ? 0 : 50,
  image: `https://placehold.co/600x600/f8fafc/334155?text=Product+${i + 1}`,
}));

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    api.get('/categories')
      .then(({ data }) => setCategoriesList(data?.categories || data?.data || []))
      .catch(console.error);
  }, []);

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
    if (category) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [page, search, sort, category]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const handleBackToCategories = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('category');
    params.delete('page');
    setSearchParams(params);
  };

  if (!category && !search) {
    return (
      <div className="page-container">
        <div className="mb-8 text-center pt-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Shop by Category</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Select a category to view our premium products</p>
        </div>
        
        {categoriesList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoriesList.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateParam('category', cat._id)}
                className="glass-card flex flex-col items-center justify-center p-8 gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 text-2xl font-extrabold uppercase overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-300 border border-brand-100 dark:border-brand-800">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    cat.name.charAt(0)
                  )}
                </div>
                <span className="font-bold text-lg dark:text-white text-center group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <LoadingSkeleton count={4} />
        )}
      </div>
    );
  }

  const currentCategoryLabel = category ? (categoriesList.find(c => c._id === category)?.name || 'Products') : (search ? `Search: ${search}` : 'Products');

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBackToCategories}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="section-title">{currentCategoryLabel}</h1>
            <p className="section-subtitle">Browse products in this category</p>
          </div>
        </div>
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
