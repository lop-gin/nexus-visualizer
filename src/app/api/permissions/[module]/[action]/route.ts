
import { NextRequest, NextResponse } from 'next/server';
import { updateRolePermission } from '@/lib/supabase/roles-service';

// Type for valid actions
type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

// API route to update a permission
export async function PUT(
  request: NextRequest,
  { params }: { params: { module: string; action: string } }
) {
  try {
    const { roleId, value } = await request.json();
    const moduleId = params.module;
    const action = params.action as PermissionAction;
    
    // Validate parameters
    if (!roleId || !moduleId) {
      return NextResponse.json(
        { error: 'Role ID and module ID are required' },
        { status: 400 }
      );
    }
    
    if (!['view', 'create', 'edit', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be one of: view, create, edit, delete' },
        { status: 400 }
      );
    }
    
    const success = await updateRolePermission(roleId, moduleId, action, value);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to update permission' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error updating permission:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update permission' },
      { status: 500 }
    );
  }
}
