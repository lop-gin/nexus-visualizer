
import { NextRequest, NextResponse } from 'next/server';
import { inviteEmployee } from '@/lib/supabase/employees-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const employeeId = params.id;
    const invitedEmployee = await inviteEmployee(employeeId);

    return NextResponse.json({ success: true, employee: invitedEmployee });
  } catch (error: any) {
    console.error('Error inviting employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to invite employee' },
      { status: 500 }
    );
  }
}
