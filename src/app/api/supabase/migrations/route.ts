import { NextRequest, NextResponse } from 'next/server';
import { executeMigrations, initializeDatabase, isDatabaseInitialized } from '@/lib/supabase/migrations';

// API route to initialize database
export async function GET() {
  try {
    const isInitialized = await isDatabaseInitialized();
    
    return NextResponse.json({ initialized: isInitialized });
  } catch (error: any) {
    console.error('Error checking database initialization:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check database initialization' },
      { status: 500 }
    );
  }
}

// API route to execute migrations
export async function POST() {
  try {
    const result = await initializeDatabase();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to initialize database' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
