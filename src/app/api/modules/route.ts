
import { NextRequest, NextResponse } from 'next/server';
import { fetchModules } from '@/lib/supabase/roles-service';

// Get all modules
export async function GET(request: NextRequest) {
  try {
    const modules = await fetchModules();
    return NextResponse.json(modules);
  } catch (error: any) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}
