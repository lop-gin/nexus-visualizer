import { NextRequest, NextResponse } from 'next/server';
import { checkSupabaseConnection, getSupabaseConfig } from '@/lib/supabase/client';

// API route to check Supabase connection status
export async function GET() {
  try {
    const connectionStatus = await checkSupabaseConnection();
    
    return NextResponse.json(connectionStatus);
  } catch (error: any) {
    console.error('Error checking Supabase connection:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to check Supabase connection' },
      { status: 500 }
    );
  }
}

// API route to get Supabase configuration
export async function POST() {
  try {
    const config = getSupabaseConfig();
    
    // Don't return the actual key in production
    const safeConfig = {
      url: config.url,
      keyLastFour: config.key.slice(-4),
    };
    
    return NextResponse.json(safeConfig);
  } catch (error: any) {
    console.error('Error getting Supabase configuration:', error);
    return NextResponse.json(
      { error: 'Failed to get Supabase configuration' },
      { status: 500 }
    );
  }
}
