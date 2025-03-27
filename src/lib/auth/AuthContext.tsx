'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';
import toast from 'react-hot-toast';

// Authentication context type definition
export type AuthContextType = {
  user: any | null;
  isLoading: boolean;
  signUp: (email: string, password: string, companyName: string, companyType: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize the Supabase client
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  
  // State for user and loading
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Authentication methods
  const signUp = async (email: string, password: string, companyName: string, companyType: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          companyName,
          companyType,
          fullName,
        },
      },
    });
    if (error) {
      toast.error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error(error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/auth/login');
    }
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      toast.error(error.message);
    }
  };

  const resetPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    }
  };

  // Provide the auth context
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signUp,
      signIn,
      signOut,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
