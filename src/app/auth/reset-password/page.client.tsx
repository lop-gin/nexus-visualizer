'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/providers/auth-provider';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Schema for reset password form
const resetPasswordFormSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordPage() {
  const { resetPassword, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);

  // Check if we have a token in the URL
  React.useEffect(() => {
    if (!searchParams.get('token')) {
      setError('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, [searchParams]);

  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    try {
      await resetPassword(data.password);
    } catch (error: any) {
      setError(error.message || 'An error occurred while resetting your password');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create New Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Enter your new password below.
            </p>
            
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  type="password"
                  label="New Password"
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
                  label="Confirm New Password"
                  error={errors.confirmPassword?.message}
                  {...field}
                />
              )}
            />
            
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Resetting..."
              disabled={!!error || isLoading}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
