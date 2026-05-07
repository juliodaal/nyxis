import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard `cn` helper used by every registry component.
 *
 * The registry build inlines this file's content into a registry item so
 * the consumer's project gets `src/lib/utils.ts` automatically when the
 * first Nyxis component is installed.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
