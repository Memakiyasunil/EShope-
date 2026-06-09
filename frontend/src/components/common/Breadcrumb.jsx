import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useSelector } from 'react-redux';

const Breadcrumb = ({ items = [] }) => {
  const breadcrumbs = useSelector((state) => state.ui.breadcrumbs);
  const crumbs = items.length > 0 ? items : breadcrumbs;

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <Home size={16} />
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-slate-400" />
            {index === crumbs.length - 1 ? (
              <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate max-w-[200px]"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
