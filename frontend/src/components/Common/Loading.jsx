import React from 'react';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          border-slate-300 
          border-t-primary-500 
          rounded-full 
          animate-spin
          ${sizeClasses[size]}
        `}
      />
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 animate-pulse">
      <div className="h-48 bg-slate-300 dark:bg-slate-700 rounded-xl mb-4" />
      <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-2/3 mb-2" />
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-full mb-2" />
      <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-5/6" />
    </div>
  );
};

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-darkBg/80 backdrop-blur-md">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-lg font-semibold text-primary-500 animate-pulse-subtle">
        Loading World Entrepreneurs Company...
      </p>
    </div>
  );
};
