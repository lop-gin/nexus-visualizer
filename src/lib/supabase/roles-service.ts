
import { supabase } from '@/lib/supabase/client';
import { Role, Permission } from '@/types/auth';

export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        permissions:permissions(
          id,
          role_id,
          module_id,
          can_view,
          can_create,
          can_edit,
          can_delete,
          created_at,
          updated_at,
          module:module_id(id, name)
        )
      `)
      .order('name');
    
    if (error) {
      throw error;
    }
    
    // Transform data to match our Role type
    return data.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      is_predefined: role.is_predefined,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permissions: role.permissions ? role.permissions.map(perm => ({
        id: perm.id,
        role_id: perm.role_id,
        module: perm.module?.name || '',
        can_view: perm.can_view,
        can_create: perm.can_create,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete,
        created_at: perm.created_at,
        updated_at: perm.updated_at,
      })) : [],
    }));
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const fetchModules = async () => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw error;
  }
};

export const fetchRoleById = async (roleId: string): Promise<Role | null> => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select(`
        *,
        permissions:permissions(
          id,
          role_id,
          module_id,
          can_view,
          can_create,
          can_edit,
          can_delete,
          created_at,
          updated_at,
          module:module_id(id, name)
        )
      `)
      .eq('id', roleId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Transform data to match our Role type
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      is_predefined: data.is_predefined,
      created_at: data.created_at,
      updated_at: data.updated_at,
      permissions: data.permissions ? data.permissions.map(perm => ({
        id: perm.id,
        role_id: perm.role_id,
        module: perm.module?.name || '',
        can_view: perm.can_view,
        can_create: perm.can_create,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete,
        created_at: perm.created_at,
        updated_at: perm.updated_at,
      })) : [],
    };
  } catch (error) {
    console.error('Error fetching role by ID:', error);
    throw error;
  }
};

export const createRole = async (
  name: string, 
  description: string | null = null, 
  permissions: any[] = []
): Promise<Role> => {
  try {
    // Insert the role
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
    
    // If permissions are provided, insert them
    if (permissions && permissions.length > 0) {
      // Fetch modules to get module IDs
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id, name');
      
      if (modulesError) {
        throw modulesError;
      }
      
      // Create a map of module names to IDs
      const moduleMap = new Map();
      modules.forEach(module => {
        moduleMap.set(module.name, module.id);
      });
      
      // Prepare permissions for insertion
      const permissionsToInsert = permissions.map(perm => ({
        role_id: roleData.id,
        module_id: moduleMap.get(perm.module) || perm.module_id,
        can_view: perm.can_view,
        can_create: perm.can_create,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete,
      }));
      
      // Insert permissions
      const { error: permissionsError } = await supabase
        .from('permissions')
        .insert(permissionsToInsert);
      
      if (permissionsError) {
        throw permissionsError;
      }
    }
    
    // Fetch the complete role with permissions
    return await fetchRoleById(roleData.id) as Role;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (
  roleId: string, 
  updates: Partial<Role>
): Promise<Role> => {
  try {
    // Update the role
    const { error: roleError } = await supabase
      .from('roles')
      .update({
        name: updates.name,
        description: updates.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roleId);
    
    if (roleError) {
      throw roleError;
    }
    
    // Fetch the updated role with permissions
    return await fetchRoleById(roleId) as Role;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (roleId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const updateRolePermission = async (
  roleId: string,
  moduleId: string,
  action: 'can_view' | 'can_create' | 'can_edit' | 'can_delete',
  value: boolean
): Promise<void> => {
  try {
    // Check if permission already exists
    const { data: existingPermission, error: checkError } = await supabase
      .from('permissions')
      .select('id')
      .eq('role_id', roleId)
      .eq('module_id', moduleId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw checkError;
    }
    
    if (existingPermission) {
      // Update existing permission
      const update: Record<string, boolean> = {};
      update[action] = value;
      
      const { error: updateError } = await supabase
        .from('permissions')
        .update(update)
        .eq('id', existingPermission.id);
      
      if (updateError) {
        throw updateError;
      }
    } else {
      // Create new permission
      const newPermission: Record<string, any> = {
        role_id: roleId,
        module_id: moduleId,
        can_view: false,
        can_create: false,
        can_edit: false,
        can_delete: false,
      };
      newPermission[action] = value;
      
      const { error: insertError } = await supabase
        .from('permissions')
        .insert([newPermission]);
      
      if (insertError) {
        throw insertError;
      }
    }
  } catch (error) {
    console.error('Error updating role permission:', error);
    throw error;
  }
};
