import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../../lib/utils.js';

export const Skeleton = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('bg-muted animate-pulse rounded-md', className)}
      {...props}
    />
  ),
);
Skeleton.displayName = 'Skeleton';
