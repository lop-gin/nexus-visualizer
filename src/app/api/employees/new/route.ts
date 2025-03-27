import { NextRequest, NextResponse } from 'next/server';
import { createEmployee, inviteEmployee } from '@/lib/supabase/employees-service';

// API route to create a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, phone, role_id, is_admin, send_invite } = body;
    
    // Create employee
    const newEmployee = await createEmployee(full_name, email, phone, role_id, is_admin);
    
    // Send invitation if requested
    if (send_invite) {
      await inviteEmployee(newEmployee.id);
    }
    
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
