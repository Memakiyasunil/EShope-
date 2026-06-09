import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

const SearchBar = ({
  placeholder = 'Search products...',
  className = '',
  onSearch,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/categories?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleClear = () => setQuery('');

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="input-field pl-10 pr-10 py-2.5 w-full"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
      {onSearch && debouncedQuery && (
        <input type="hidden" value={debouncedQuery} />
      )}
    </form>
  );
};

export default SearchBar;
