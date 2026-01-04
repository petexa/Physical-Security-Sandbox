import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './SkeletonLoader.css';

// Table skeleton - shows rows of data
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="skeleton-table-cell">
              <Skeleton height={24} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Card skeleton - shows content card placeholder
export function CardSkeleton({ count = 1 }) {
  return (
    <div className="skeleton-card-container">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <Skeleton height={200} style={{ marginBottom: '12px' }} />
          <Skeleton width="80%" height={20} style={{ marginBottom: '8px' }} />
          <Skeleton width="60%" height={16} />
        </div>
      ))}
    </div>
  );
}

// Text skeleton - shows multiple lines of text
export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="skeleton-text">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          width={index === lines - 1 ? '80%' : '100%'}
          height={16}
          style={{ marginBottom: index < lines - 1 ? '8px' : '0' }}
        />
      ))}
    </div>
  );
}

// Dashboard stats skeleton
export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="skeleton-stats">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-stat-card">
          <Skeleton circle width={40} height={40} style={{ marginBottom: '12px' }} />
          <Skeleton width="70%" height={16} style={{ marginBottom: '4px' }} />
          <Skeleton width="50%" height={24} />
        </div>
      ))}
    </div>
  );
}

// Detail view skeleton
export function DetailSkeleton() {
  return (
    <div className="skeleton-detail">
      <Skeleton height={40} style={{ marginBottom: '20px' }} />
      <div className="skeleton-detail-grid">
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
      </div>
      <Skeleton count={3} height={24} style={{ marginBottom: '8px' }} />
    </div>
  );
}

// List skeleton - simplified version for small lists
export function ListSkeleton({ items = 5 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="skeleton-list-item">
          <Skeleton height={20} style={{ marginBottom: '8px' }} />
        </div>
      ))}
    </div>
  );
}
