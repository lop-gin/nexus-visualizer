
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if a string is a valid UUID
 */
export function isValidId(id: string | undefined): boolean {
  if (!id) return false;
  
  // Basic UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Truncate a string to a specified length
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Ensures that the input value is always a string, even if it's undefined
 */
export function ensureString(value: string | undefined): string {
  return value || '';
}

/**
 * Validates if the status is one of the allowed values
 */
export function isValidStatus(status: string): status is 'active' | 'inactive' | 'invited' {
  return ['active', 'inactive', 'invited'].includes(status);
}
