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

// Schema for login form
const loginFormSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const { signIn, isLoading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const { 
    control, 
    handleSubmit, 
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await signIn(data.email, data.password);
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            
            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              loadingText="Signing In..."
            >
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-800">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
