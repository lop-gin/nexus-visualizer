
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add type coercion functions
export function asString(value: any, defaultValue: string = ''): string {
  if (value === null || value === undefined) return defaultValue;
  return String(value);
}

export function asNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export function asEnum<T extends string>(value: any, validValues: T[], defaultValue: T): T {
  if (value === null || value === undefined) return defaultValue;
  return validValues.includes(value as T) ? (value as T) : defaultValue;
}

// Helper for handling null/undefined in string parameters
export function ensureString(value: string | null | undefined): string {
  return value ?? '';
}

// Type guard for employee status
export function isValidStatus(status: string): status is 'active' | 'inactive' | 'invited' {
  return ['active', 'inactive', 'invited'].includes(status);
}
