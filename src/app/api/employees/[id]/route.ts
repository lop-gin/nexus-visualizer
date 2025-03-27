
import { NextRequest, NextResponse } from 'next/server';
import { fetchEmployeeById, updateEmployeeStatus } from '@/lib/supabase/employees-service';

// Get employee by ID
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
  } catch (error: any) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch employee' },
      { status: 500 }
    );
  }
}

// Update employee status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const result = await updateEmployeeStatus(params.id, status);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update employee status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating employee status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update employee status' },
      { status: 500 }
    );
  }
}
