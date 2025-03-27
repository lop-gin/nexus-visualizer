import { supabase } from '@/lib/supabase/client';
import { Role, Permission } from '@/types/auth';
import { ensureString } from '@/lib/utils';

// Fetch all roles
export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

// Fetch modules for permissions
export const fetchModules = async () => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};

// Create a new role with permissions
export const createRole = async (
  name: string, 
  description: string | null = null,
  permissions: { module_id: string; can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean; }[] = []
): Promise<Role> => {
  try {
    // Create the role first
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .insert({
        name,
        description,
        is_predefined: false,
      })
      .select()
      .single();

    if (roleError) {
      throw roleError;
    }

    // If we have permissions, create them
    if (permissions.length > 0) {
      const permissionInserts = permissions.map(perm => ({
        role_id: roleData.id,
        module_id: perm.module_id,
        can_view: perm.can_view,
        can_create: perm.can_create,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete,
      }));

      const { error: permError } = await supabase
        .from('permissions')
        .insert(permissionInserts);

      if (permError) {
        throw permError;
      }
    }

    return roleData;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

// Fetch a role by ID with its permissions
export const fetchRoleById = async (roleId: string): Promise<Role | null> => {
  try {
    if (!roleId) {
      throw new Error('Role ID is required');
    }
    
    // Fetch the role
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('*')
      .eq('id', roleId)
      .single();

    if (roleError) {
      throw roleError;
    }

    if (!roleData) {
      return null;
    }

    // Fetch the permissions for this role
    const { data: permissionsData, error: permError } = await supabase
      .from('permissions')
      .select(`
        *,
        module:module_id(id, name)
      `)
      .eq('role_id', roleId);

    if (permError) {
      throw permError;
    }

    // Format permissions to match the Permission type
    const formattedPermissions: Permission[] = permissionsData.map(perm => ({
      id: perm.id,
      role_id: perm.role_id,
      module: perm.module.name,
      module_id: perm.module_id,
      can_view: perm.can_view,
      can_create: perm.can_create,
      can_edit: perm.can_edit,
      can_delete: perm.can_delete,
      created_at: perm.created_at,
      updated_at: perm.updated_at
    }));

    // Return the role with permissions
    return {
      ...roleData,
      permissions: formattedPermissions
    };
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw error;
  }
};

// Update a role and its permissions
export const updateRole = async (
  roleId: string, 
  name: string, 
  description: string | null = null,
  permissions: { module_id: string; can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean; }[] = []
): Promise<Role> => {
  if (!roleId) {
    throw new Error('Role ID is required');
  }
  
  try {
    // Start a transaction
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .update({
        name,
        description,
        updated_at: new Date().toISOString()
      })
      .eq('id', roleId)
      .select()
      .single();

    if (roleError) {
      throw roleError;
    }

    // Delete existing permissions
    const { error: deleteError } = await supabase
      .from('permissions')
      .delete()
      .eq('role_id', roleId);

    if (deleteError) {
      throw deleteError;
    }

    // Insert new permissions
    if (permissions.length > 0) {
      // Map each permission to include role_id
      const permissionsWithRoleId = permissions.map(perm => ({
        role_id: roleId,
        module_id: perm.module_id,
        can_view: perm.can_view,
        can_create: perm.can_create,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete
      }));

      const { error: insertError } = await supabase
        .from('permissions')
        .insert(permissionsWithRoleId);

      if (insertError) {
        throw insertError;
      }
    }

    // Fetch updated role with permissions
    return await fetchRoleById(roleId) as Role;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

// Check if a user has a specific permission
export const checkPermission = async (userId: string, module: string, action: 'view' | 'create' | 'edit' | 'delete'): Promise<boolean> => {
  if (!userId || !module || !action) {
    return false;
  }
  
  try {
    // First get the user's role
    const { data: userData, error: userError } = await supabase
      .from('employees')
      .select('role_id, is_admin')
      .eq('user_id', userId)
      .single();

    if (userError) {
      throw userError;
    }

    // Admins have all permissions
    if (userData?.is_admin) {
      return true;
    }

    // No role assigned
    if (!userData?.role_id) {
      return false;
    }

    // Get the module ID
    const { data: moduleData, error: moduleError } = await supabase
      .from('modules')
      .select('id')
      .eq('name', module)
      .single();

    if (moduleError) {
      throw moduleError;
    }

    // Check permission
    const actionField = `can_${action}`;
    const { data: permData, error: permError } = await supabase
      .from('permissions')
      .select(actionField)
      .eq('role_id', userData.role_id)
      .eq('module_id', moduleData.id)
      .single();

    if (permError) {
      return false; // No permission found
    }

    return !!permData[actionField];
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};

// Delete a role
export const deleteRole = async (roleId: string): Promise<void> => {
  if (!roleId) {
    throw new Error('Role ID is required');
  }
  
  try {
    // Check if this is a predefined role
    const { data: roleData, error: roleCheckError } = await supabase
      .from('roles')
      .select('is_predefined')
      .eq('id', roleId)
      .single();

    if (roleCheckError) {
      throw roleCheckError;
    }

    if (roleData.is_predefined) {
      throw new Error('Cannot delete predefined roles');
    }

    // Delete the role (permissions will be automatically deleted due to CASCADE)
    const { error: deleteError } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);

    if (deleteError) {
      throw deleteError;
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

/**
 * Update a role permission for a specific module and action
 */
export async function updateRolePermission(
  roleId: string,
  moduleId: string,
  action: 'view' | 'create' | 'edit' | 'delete',
  value: boolean
): Promise<boolean> {
  try {
    // Determine which field to update based on the action
    let updateField: string;
    switch(action) {
      case 'view':
        updateField = 'can_view';
        break;
      case 'create':
        updateField = 'can_create';
        break;
      case 'edit':
        updateField = 'can_edit';
        break;
      case 'delete':
        updateField = 'can_delete';
        break;
    }

    // Update the permission
    const { error } = await supabase
      .from('permissions')
      .update({ [updateField]: value })
      .match({ role_id: roleId, module_id: moduleId });

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error updating role permission:', error);
    return false;
  }
}
