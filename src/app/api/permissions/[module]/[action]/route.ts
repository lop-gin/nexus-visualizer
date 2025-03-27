import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// API route to check if user has permission for a specific action on a module
export async function GET(
  request: NextRequest,
  { params }: { params: { module: string; action: string } }
) {
  try {
    const { module, action } = params;
    
    // Validate action
    if (!['view', 'create', 'edit', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    // Get user from session
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Get user's role
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('role_id, is_admin')
      .eq('user_id', userId)
      .single();
    
    if (employeeError) {
      console.error('Error fetching employee:', employeeError);
      return NextResponse.json(
        { error: 'Failed to fetch employee data' },
        { status: 500 }
      );
    }
    
    // If user is admin, they have all permissions
    if (employee.is_admin) {
      return NextResponse.json({ hasPermission: true });
    }
    
    // If user has no role, they have no permissions
    if (!employee.role_id) {
      return NextResponse.json({ hasPermission: false });
    }
    
    // Get module ID
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('name', module)
      .single();
    
    if (moduleError) {
      console.error('Error fetching module:', moduleError);
      return NextResponse.json(
        { error: 'Failed to fetch module data' },
        { status: 500 }
      );
    }
    
    // Check permission
    const { data: permission, error: permissionError } = await supabase
      .from('permissions')
      .select(`can_${action}`)
      .eq('role_id', employee.role_id)
      .eq('module_id', moduleData.id)
      .single();
    
    if (permissionError) {
      console.error('Error fetching permission:', permissionError);
      return NextResponse.json({ hasPermission: false });
    }
    
    return NextResponse.json({ hasPermission: permission[`can_${action}`] || false });
  } catch (error) {
    console.error('Error checking permission:', error);
    return NextResponse.json(
      { error: 'Failed to check permission' },
      { status: 500 }
    );
  }
}
