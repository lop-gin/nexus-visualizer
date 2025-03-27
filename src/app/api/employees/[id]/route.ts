
import { NextRequest, NextResponse } from 'next/server';
import { fetchEmployeeById, updateEmployee, deleteEmployee, sendEmployeeInvitation } from '@/lib/supabase/employees-service';

// API route to get a specific employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await fetchEmployeeById(params.id);
    
    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// API route to update an employee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { full_name, email, phone, role_id, is_admin, send_invite } = body;
    
    const updatedEmployee = await updateEmployee(
      params.id,
      full_name,
      email,
      phone,
      role_id,
      is_admin
    );
    
    // Send invitation if requested
    if (send_invite) {
      await sendEmployeeInvitation(params.id);
    }
    
    return NextResponse.json(updatedEmployee);
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update employee' },
      { status: 500 }
    );
  }
}

// API route to delete an employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteEmployee(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete employee' },
      { status: 500 }
    );
  }
}
