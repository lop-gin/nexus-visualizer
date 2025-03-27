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

// Schema for forgot password form
const forgotPasswordFormSchema = z.object({
  email: z.string().email('Valid email is required'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setSuccess(false);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the password reset email');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {success ? (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              Password reset email sent. Please check your inbox and follow the instructions to reset your password.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
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
              
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                loadingText="Sending..."
              >
                Send Reset Link
              </Button>
            </form>
          )}
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
