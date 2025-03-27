
import { NextRequest, NextResponse } from 'next/server';
import { executeSQLMigration } from '@/lib/supabase/migrations';

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json();
    
    if (!sql) {
      return NextResponse.json(
        { error: 'SQL query is required' },
        { status: 400 }
      );
    }

    const result = await executeSQLMigration(sql);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error executing SQL migration:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to execute SQL migration' },
      { status: 500 }
    );
  }
}

// Helper function to initialize the database
export async function GET() {
  try {
    // Initialize the database with predefined data
    const result = {
      success: true,
      message: 'Migration functions still need to be implemented',
      details: [
        'createRoles and createModules need to be implemented'
      ]
    };
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
