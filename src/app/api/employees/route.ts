import { NextResponse } from 'next/server';
import { fetchEmployees } from '@/lib/supabase/employees-service';
import { fetchRoles } from '@/lib/supabase/roles-service';

// API route to get all employees and roles
export async function GET() {
  try {
    // Fetch employees and roles in parallel
    const [employees, roles] = await Promise.all([
      fetchEmployees(),
      fetchRoles()
    ]);
    
    return NextResponse.json({ employees, roles });
  } catch (error) {
    console.error('Error fetching employees and roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees and roles' },
      { status: 500 }
    );
  }
}
