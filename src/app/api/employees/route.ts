
import { NextRequest, NextResponse } from 'next/server';
import { fetchEmployees } from '@/lib/supabase/employees-service';

// Get all employees
export async function GET(request: NextRequest) {
  try {
    const employees = await fetchEmployees();
    return NextResponse.json(employees);
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}
