'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';
import Link from 'next/link';

// Schema for registration form
const registerFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
  companyName: z.string().min(1, 'Company name is required'),
  companyType: z.enum(['manufacturer', 'distributor', 'both'], {
    errorMap: () => ({ message: 'Please select a company type' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function RegisterPage() {
  const { signUp, isLoading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      companyType: 'both',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await signUp(
        data.email,
        data.password,
        data.companyName,
        data.companyType,
        data.fullName
      );
    } catch (error: any) {
      setError(error.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Full Name"
                  error={errors.fullName?.message}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  label="Email"
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  label="Password"
                  error={errors.password?.message}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  label="Confirm Password"
                  error={errors.confirmPassword?.message}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => (
                <Input
                  label="Company Name"
                  error={errors.companyName?.message}
                  {...field}
                />
              )}
            />
            
            <Controller
              name="companyType"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...field}
                  >
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="both">Both</option>
                  </select>
                  {errors.companyType && (
                    <p className="text-xs text-red-500">{errors.companyType.message}</p>
                  )}
                </div>
              )}
            />
            
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Creating Account..."
            >
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
