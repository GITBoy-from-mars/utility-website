import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 6 }) => {
  if (type === 'page') {
    return (
      <div className="skeleton-page">
        <div className="skeleton-hero">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-subtitle" />
        </div>
        <div className="skeleton-grid">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-icon" />
              <div className="skeleton-line" style={{ width: '70%' }} />
              <div className="skeleton-line" style={{ width: '90%' }} />
              <div className="skeleton-line" style={{ width: '50%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'tool') {
    return (
      <div className="skeleton-tool">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-subtitle" />
        <div className="skeleton-upload-area" />
        <div className="skeleton-line" style={{ width: '40%', margin: '16px auto 0' }} />
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-icon" />
          <div className="skeleton-line" style={{ width: '70%' }} />
          <div className="skeleton-line" style={{ width: '90%' }} />
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
