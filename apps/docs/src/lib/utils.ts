import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard `cn` helper. Identical to the one shipped through the
 * Nyxis registry (`registry/lib/utils.ts`) — kept here so both the docs
 * site's own components and the registry components it dogfoods resolve
 * `@/lib/utils` to the same implementation.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
