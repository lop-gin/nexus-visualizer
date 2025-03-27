
import { NextRequest, NextResponse } from 'next/server';
import { createEmployee, sendEmployeeInvitation } from '@/lib/supabase/employees-service';

// Create a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, full_name, role_id, company_id, is_admin } = body;
    
    // Validate required fields
    if (!email || !full_name) {
      return NextResponse.json(
        { error: 'Email and full name are required' },
        { status: 400 }
      );
    }
    
    // Create the employee record
    const newEmployee = await createEmployee({
      email,
      full_name,
      role_id,
      company_id,
      is_admin: is_admin || false,
      status: 'invited',
      invitation_sent: false
    });
    
    // Send invitation email (in a real app)
    await sendEmployeeInvitation(email, full_name, role_id, company_id, is_admin || false);
    
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}
