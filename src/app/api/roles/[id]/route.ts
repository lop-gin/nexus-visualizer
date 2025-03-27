
import { NextRequest, NextResponse } from 'next/server';
import { fetchRoleById, updateRole, deleteRole } from '@/lib/supabase/roles-service';

// API route to get a specific role by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const role = await fetchRoleById(params.id);
    
    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch role' },
      { status: 500 }
    );
  }
}

// API route to update a role
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const roleId = params.id;
    
    const updatedRole = await updateRole(roleId, {
      name: body.name,
      description: body.description
    });
    
    return NextResponse.json(updatedRole);
  } catch (error: any) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update role' },
      { status: 500 }
    );
  }
}

// API route to delete a role
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteRole(params.id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete role' },
      { status: 500 }
    );
  }
}
