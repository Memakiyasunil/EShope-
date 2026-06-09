const LoadingSkeleton = ({ variant = 'card', count = 1, className = '' }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((i) => (
          <div key={i} className="skeleton h-4 w-full" style={{ width: `${85 - i * 10}%` }} />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {items.map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="skeleton h-12 w-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="skeleton h-10 w-full rounded-lg" />
        {items.map((i) => (
          <div key={i} className="skeleton h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="skeleton h-8 w-2/3 max-w-md" />
        <div className="skeleton h-4 w-full max-w-lg" />
        <div className="skeleton h-4 w-4/5 max-w-md" />
        <div className="flex gap-3 mt-4">
          <div className="skeleton h-10 w-32 rounded-lg" />
          <div className="skeleton h-10 w-32 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {items.map((i) => (
        <div key={i} className="glass-card p-0 overflow-hidden">
          <div className="skeleton h-48 w-full rounded-none" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <div className="skeleton h-5 w-20" />
              <div className="skeleton h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
