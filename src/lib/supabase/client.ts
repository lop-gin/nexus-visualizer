import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Environment variables for Supabase connection
// These can be overridden by environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aoyaamulrgpdidzpotty.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFveWFhbXVscmdwZGlkenBvdHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5OTU1MjYsImV4cCI6MjA1ODU3MTUyNn0.9DhaZQEjOZ5gPXfq14Kz2QdPoVwh-BBd6-Ho-I7TmLM';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Function to check if Supabase connection is working
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('roles').select('count').single();
    if (error) throw error;
    return { success: true, message: 'Connected to Supabase successfully' };
  } catch (error: any) {
    console.error('Supabase connection error:', error);
    return { success: false, message: error.message || 'Failed to connect to Supabase' };
  }
}

// Function to get Supabase configuration
export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    key: supabaseAnonKey,
  };
}
