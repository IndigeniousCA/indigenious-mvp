import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`skeleton rounded ${className}`} />
  );
};

export const BusinessCardSkeleton: React.FC = () => {
  return (
    <div className="stat-card rounded-2xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
};

export const PricingCardSkeleton: React.FC = () => {
  return (
    <div className="stat-card rounded-2xl p-8">
      <div className="text-center mb-6">
        <Skeleton className="h-8 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      <div className="text-center mb-8">
        <Skeleton className="h-12 w-40 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>

      <div className="space-y-4 mb-8">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="space-y-3 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  );
};