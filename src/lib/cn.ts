import { clsx, type ClassValue } from 'clsx';

/**
 * Merges class names conditionally. Thin wrapper around clsx so every
 * component composes class names the same way.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
