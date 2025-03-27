import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This allows for conditional classes and proper merging of tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | undefined | null,
  options: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  if (value === undefined || value === null) return "";

  const {
    currency = "USD",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a date string to a localized date string
 * @param dateString - ISO date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | undefined | null,
  options: {
    locale?: string;
    format?: Intl.DateTimeFormatOptions;
  } = {}
): string {
  if (!dateString) return "";

  const { locale = "en-US", format } = options;
  const date = new Date(dateString);

  const defaultFormat: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString(locale, format || defaultFormat);
}

/**
 * Generates a random ID
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Truncates a string to a specified length
 * @param str - The string to truncate
 * @param length - Maximum length
 * @returns Truncated string
 */
export function truncateString(str: string, length: number): string {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

/**
 * Debounces a function
 * @param fn - The function to debounce
 * @param ms - Debounce delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Formats a number with commas
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(
  num: number | undefined | null,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  if (num === undefined || num === null) return "";

  const {
    locale = "en-US",
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

/**
 * Calculates the total amount for a document item
 * @param quantity - Item quantity
 * @param unitPrice - Item unit price
 * @param taxPercent - Item tax percentage
 * @returns Total amount
 */
export function calculateItemAmount(
  quantity: number,
  unitPrice: number,
  taxPercent?: number | null
): number {
  const subtotal = quantity * unitPrice;
  if (!taxPercent) return subtotal;
  
  const taxAmount = subtotal * (taxPercent / 100);
  return subtotal + taxAmount;
}

/**
 * Safely parses a JSON string
 * @param jsonString - The JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return fallback;
  }
}
