
import { NextRequest, NextResponse } from 'next/server';
import { createEmployee, sendEmployeeInvitation } from '@/lib/supabase/employees-service';
import { employeeSchema } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate employee data
    const employeeData = employeeSchema.parse({
      full_name: body.full_name,
      email: body.email,
      phone: body.phone || null,
      address: body.address || null,
      role_id: body.role_id,
      is_admin: body.is_admin || false,
      status: 'invited',
      // We need to get company_id from current user
      company_id: 'company_id_here', // Replace with actual company ID
    });
    
    // Create employee in database
    const newEmployee = await createEmployee(employeeData, body.send_invite || false);
    
    // Send invitation if requested
    if (body.send_invite) {
      if (newEmployee.id) {
        await sendEmployeeInvitation(newEmployee.id);
      }
    }
    
    return NextResponse.json({ success: true, employee: newEmployee });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create employee' },
      { status: 400 }
    );
  }
}
