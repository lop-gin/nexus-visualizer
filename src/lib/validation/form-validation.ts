import { z } from 'zod';

// Common utility functions for form validation
export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value) return `${fieldName} is required`;
  if (typeof value === 'string' && value.trim() === '') return `${fieldName} is required`;
  return null;
};

export const validateEmail = (value: string): string | null => {
  if (!value) return null; // Only validate if a value is provided
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : 'Please enter a valid email address';
};

export const validatePhone = (value: string): string | null => {
  if (!value) return null; // Only validate if a value is provided
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  return phoneRegex.test(value) ? null : 'Please enter a valid phone number';
};

export const validateNumber = (value: any, fieldName: string, options?: { min?: number; max?: number }): string | null => {
  if (value === undefined || value === null || value === '') return null;
  
  const num = Number(value);
  if (isNaN(num)) return `${fieldName} must be a valid number`;
  
  if (options?.min !== undefined && num < options.min) {
    return `${fieldName} must be at least ${options.min}`;
  }
  
  if (options?.max !== undefined && num > options.max) {
    return `${fieldName} must be at most ${options.max}`;
  }
  
  return null;
};

// Form validation schemas using zod
export const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  company_name: z.string().min(1, 'Company name is required'),
  company_type: z.string().min(1, 'Company type is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().optional(),
  phone: z.string().optional(),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
