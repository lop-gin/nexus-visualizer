
import { NextResponse } from 'next/server';
import { fetchRoles, fetchModules } from '@/lib/supabase/roles-service';

// API route to get all roles and modules
export async function GET() {
  try {
    // Fetch roles and modules in parallel
    const [roles, modules] = await Promise.all([
      fetchRoles(),
      fetchModules()
    ]);
    
    return NextResponse.json({ roles, modules });
  } catch (error) {
    console.error('Error fetching roles and modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles and modules' },
      { status: 500 }
    );
  }
}
