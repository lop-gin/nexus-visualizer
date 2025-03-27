import { NextRequest, NextResponse } from 'next/server';
import { fetchRoles, fetchModules } from '@/lib/supabase/roles-service';

// Get all roles
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const include = searchParams.get('include');
    
    if (include === 'modules') {
      // If modules are requested, fetch both roles and modules
      const [roles, modules] = await Promise.all([
        fetchRoles(),
        fetchModules()
      ]);
      
      return NextResponse.json({ roles, modules });
    } else {
      // Otherwise just fetch roles
      const roles = await fetchRoles();
      return NextResponse.json(roles);
    }
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}
