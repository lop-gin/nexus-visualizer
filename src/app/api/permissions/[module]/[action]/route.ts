
import { NextRequest, NextResponse } from 'next/server';
import { updateRolePermissions } from '@/lib/supabase/roles-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { module: string; action: string } }
) {
  try {
    const { roleId, value } = await request.json();
    const moduleId = params.module;
    const action = params.action;

    if (!roleId || !moduleId || !action) {
      return NextResponse.json(
        { error: 'Role ID, module ID, and action are required' },
        { status: 400 }
      );
    }

    // Convert action name to permission field name
    let permissionField;
    switch (action) {
      case 'view':
        permissionField = 'can_view';
        break;
      case 'create':
        permissionField = 'can_create';
        break;
      case 'edit':
        permissionField = 'can_edit';
        break;
      case 'delete':
        permissionField = 'can_delete';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update permission
    const result = await updateRolePermissions(roleId, moduleId, {
      [permissionField]: value === 'true' || value === true
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update permission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating permission:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update permission' },
      { status: 500 }
    );
  }
}
