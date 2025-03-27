
import { NextRequest, NextResponse } from 'next/server';
import { updateRolePermission } from '@/lib/supabase/roles-service';
import { supabase } from '@/lib/supabase/client';

interface RouteParams {
  params: {
    module: string;
    action: 'view' | 'create' | 'edit' | 'delete';
  };
}

/**
 * Updates permission for a role on a specific module and action
 * 
 * Request body should include:
 * - roleId: string (ID of the role)
 * - value: boolean (permission value - true for allow, false for deny)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { module, action } = params;
    const { roleId, value } = await request.json();
    
    if (!roleId) {
      throw new Error('Role ID is required');
    }
    
    if (value === undefined) {
      throw new Error('Permission value is required');
    }
    
    if (!['view', 'create', 'edit', 'delete'].includes(action)) {
      throw new Error('Invalid action');
    }
    
    // Get the module ID from its name
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('name', module)
      .single();
    
    if (moduleError) {
      throw new Error(`Module "${module}" not found`);
    }
    
    // Format action to match database column name
    const dbAction = `can_${action}` as 'can_view' | 'can_create' | 'can_edit' | 'can_delete';
    
    // Update the permission
    await updateRolePermission(roleId, moduleData.id, dbAction, value);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating permission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update permission' },
      { status: 400 }
    );
  }
}

/**
 * Gets the current permission for a role on a specific module and action
 * 
 * Request should include query parameter:
 * - roleId: string (ID of the role)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { module, action } = params;
    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('roleId');
    
    if (!roleId) {
      throw new Error('Role ID is required');
    }
    
    if (!['view', 'create', 'edit', 'delete'].includes(action)) {
      throw new Error('Invalid action');
    }
    
    // Get the module ID from its name
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('name', module)
      .single();
    
    if (moduleError) {
      throw new Error(`Module "${module}" not found`);
    }
    
    // Get the permission
    const { data: permission, error: permissionError } = await supabase
      .from('permissions')
      .select('*')
      .eq('role_id', roleId)
      .eq('module_id', moduleData.id)
      .single();
    
    if (permissionError && permissionError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw permissionError;
    }
    
    // Format action to match database column name
    const dbAction = `can_${action}` as 'can_view' | 'can_create' | 'can_edit' | 'can_delete';
    
    // Return permission value (default to false if not found)
    return NextResponse.json({ 
      success: true, 
      value: permission ? permission[dbAction] : false 
    });
  } catch (error: any) {
    console.error('Error getting permission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get permission' },
      { status: 400 }
    );
  }
}
