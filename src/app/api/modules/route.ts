
import { NextResponse } from 'next/server';
import { fetchModules } from '@/lib/supabase/roles-service';

export async function GET() {
  try {
    const modules = await fetchModules();
    return NextResponse.json({ modules });
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}
