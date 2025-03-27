
import { NextRequest, NextResponse } from 'next/server';
import { updateRole, deleteRole, updateRolePermissions } from '@/lib/supabase/roles-service';

// Get role by ID - This is missing but could be implemented here
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // This would typically call a service function to get the role by ID
    return NextResponse.json({ message: 'Not implemented yet' }, { status: 501 });
  } catch (error: any) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// Update role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Update basic role info
    const updatedRole = await updateRole(id, {
      name: body.name,
      description: body.description
    });
    
    // If permissions are included, update them
    if (body.permissions) {
      await updateRolePermissions(id, body.permissions);
    }
    
    return NextResponse.json(updatedRole);
  } catch (error: any) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}

// Delete role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteRole(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete role' },
      { status: 500 }
    );
  }
}
