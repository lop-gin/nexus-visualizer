
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { ensureString } from '@/lib/utils';

/**
 * Fetch roles
 */
export async function fetchRoles() {
  try {
    const supabase = createClientComponentClient<Database>();
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        permissions (
          module_id,
          can_view,
          can_create,
          can_edit,
          can_delete
        )
      `)
      .order('name');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

/**
 * Fetch modules
 */
export async function fetchModules() {
  try {
    const supabase = createClientComponentClient<Database>();
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
}

/**
 * Create a new role
 */
export async function createRole(name: string, description?: string, permissions?: any[]) {
  try {
    const supabase = createClientComponentClient<Database>();
    
    // Create the role
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert({
        name,
        description: description || null,
        is_predefined: false
      })
      .select()
      .single();
      
    if (roleError) throw roleError;
    if (!role) throw new Error('Failed to create role');
    
    // If permissions are provided, add them
    if (permissions && permissions.length > 0) {
      const permissionsToInsert = permissions.map(p => ({
        role_id: role.id,
        module_id: p.module_id,
        can_view: Boolean(p.can_view),
        can_create: Boolean(p.can_create),
        can_edit: Boolean(p.can_edit),
        can_delete: Boolean(p.can_delete)
      }));
      
      const { error: permissionsError } = await supabase
        .from('permissions')
        .insert(permissionsToInsert);
        
      if (permissionsError) throw permissionsError;
    }
    
    return role;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

/**
 * Update a role
 */
export async function updateRole(id: string, data: { name: string; description: string }) {
  try {
    const supabase = createClientComponentClient<Database>();
    
    const { data: role, error } = await supabase
      .from('roles')
      .update({
        name: data.name,
        description: data.description || null
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    return role;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
}

/**
 * Delete a role
 */
export async function deleteRole(id: string) {
  try {
    const supabase = createClientComponentClient<Database>();
    
    // First delete all permissions for this role
    const { error: permissionsError } = await supabase
      .from('permissions')
      .delete()
      .eq('role_id', id);
      
    if (permissionsError) throw permissionsError;
    
    // Then delete the role
    const { error: roleError } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
      
    if (roleError) throw roleError;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
}

/**
 * Update role permissions
 */
export async function updateRolePermissions(
  roleId: string,
  permissions: Array<{
    module_id: string;
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
  }>
) {
  try {
    const supabase = createClientComponentClient<Database>();
    
    // Delete existing permissions
    const { error: deleteError } = await supabase
      .from('permissions')
      .delete()
      .eq('role_id', roleId);
      
    if (deleteError) throw deleteError;
    
    // Insert new permissions
    const permissionsToInsert = permissions.map(p => ({
      role_id: roleId,
      module_id: p.module_id,
      can_view: p.can_view,
      can_create: p.can_create,
      can_edit: p.can_edit,
      can_delete: p.can_delete
    }));
    
    const { data, error: insertError } = await supabase
      .from('permissions')
      .insert(permissionsToInsert)
      .select();
      
    if (insertError) throw insertError;
    
    return data;
  } catch (error) {
    console.error('Error updating role permissions:', error);
    throw error;
  }
}
