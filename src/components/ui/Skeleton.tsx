import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-white/10',
        className
      )}
    />
  );
}

export function PricingCardSkeleton() {
  return <Skeleton className="h-96" />;
}

export function BusinessCardSkeleton() {
  return <Skeleton className="h-64" />;
}