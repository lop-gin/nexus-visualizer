import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { DbRole, DbPermission, DbModule } from '@/lib/supabase/schema';
import { Role, Permission } from '@/types/auth';

// Create a Supabase client for server components
export async function getServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

// Fetch all roles with their permissions
export async function fetchRoles(): Promise<Role[]> {
  const supabase = await getServerSupabaseClient();
  
  // Fetch roles
  const { data: roles, error: rolesError } = await supabase
    .from('roles')
    .select('*')
    .order('name');
  
  if (rolesError) {
    console.error('Error fetching roles:', rolesError);
    throw new Error('Failed to fetch roles');
  }
  
  // Fetch permissions for all roles
  const { data: permissions, error: permissionsError } = await supabase
    .from('permissions')
    .select(`
      *,
      modules:module_id(id, name, description)
    `);
  
  if (permissionsError) {
    console.error('Error fetching permissions:', permissionsError);
    throw new Error('Failed to fetch permissions');
  }
  
  // Map permissions to roles
  const rolesWithPermissions = roles.map((role: DbRole) => {
    const rolePermissions = permissions.filter(
      (permission: any) => permission.role_id === role.id
    );
    
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      is_predefined: role.is_predefined,
      created_at: role.created_at,
      updated_at: role.updated_at,
      permissions: rolePermissions.map((permission: any) => ({
        id: permission.id,
        role_id: permission.role_id,
        module_id: permission.module_id,
        module: permission.modules,
        can_view: permission.can_view,
        can_create: permission.can_create,
        can_edit: permission.can_edit,
        can_delete: permission.can_delete,
        created_at: permission.created_at,
        updated_at: permission.updated_at,
      })),
    };
  });
  
  return rolesWithPermissions;
}

// Fetch a single role by ID with its permissions
export async function fetchRoleById(id: string): Promise<Role | null> {
  const supabase = await getServerSupabaseClient();
  
  // Fetch role
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (roleError) {
    console.error('Error fetching role:', roleError);
    throw new Error('Failed to fetch role');
  }
  
  if (!role) {
    return null;
  }
  
  // Fetch permissions for this role
  const { data: permissions, error: permissionsError } = await supabase
    .from('permissions')
    .select(`
      *,
      modules:module_id(id, name, description)
    `)
    .eq('role_id', id);
  
  if (permissionsError) {
    console.error('Error fetching permissions:', permissionsError);
    throw new Error('Failed to fetch permissions');
  }
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    is_predefined: role.is_predefined,
    created_at: role.created_at,
    updated_at: role.updated_at,
    permissions: permissions.map((permission: any) => ({
      id: permission.id,
      role_id: permission.role_id,
      module_id: permission.module_id,
      module: permission.modules,
      can_view: permission.can_view,
      can_create: permission.can_create,
      can_edit: permission.can_edit,
      can_delete: permission.can_delete,
      created_at: permission.created_at,
      updated_at: permission.updated_at,
    })),
  };
}

// Fetch all modules
export async function fetchModules(): Promise<DbModule[]> {
  const supabase = await getServerSupabaseClient();
  
  const { data: modules, error } = await supabase
    .from('modules')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching modules:', error);
    throw new Error('Failed to fetch modules');
  }
  
  return modules;
}

// Create a new role with permissions
export async function createRole(
  name: string, 
  description: string | null, 
  permissions: { module_id: string; can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean; }[]
): Promise<Role> {
  const supabase = await getServerSupabaseClient();
  
  // Start a transaction
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .insert({ name, description })
    .select()
    .single();
  
  if (roleError) {
    console.error('Error creating role:', roleError);
    throw new Error('Failed to create role');
  }
  
  // Insert permissions
  const permissionsToInsert = permissions.map(permission => ({
    role_id: role.id,
    module_id: permission.module_id,
    can_view: permission.can_view,
    can_create: permission.can_create,
    can_edit: permission.can_edit,
    can_delete: permission.can_delete,
  }));
  
  const { data: insertedPermissions, error: permissionsError } = await supabase
    .from('permissions')
    .insert(permissionsToInsert)
    .select();
  
  if (permissionsError) {
    console.error('Error creating permissions:', permissionsError);
    throw new Error('Failed to create permissions');
  }
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    created_at: role.created_at,
    updated_at: role.updated_at,
    permissions: insertedPermissions,
  };
}

// Update an existing role and its permissions
export async function updateRole(
  id: string,
  name: string, 
  description: string | null, 
  permissions: { module_id: string; can_view: boolean; can_create: boolean; can_edit: boolean; can_delete: boolean; }[]
): Promise<Role> {
  const supabase = await getServerSupabaseClient();
  
  // Check if role is predefined
  const { data: existingRole, error: checkError } = await supabase
    .from('roles')
    .select('is_predefined')
    .eq('id', id)
    .single();
  
  if (checkError) {
    console.error('Error checking role:', checkError);
    throw new Error('Failed to check role');
  }
  
  if (existingRole.is_predefined) {
    throw new Error('Predefined roles cannot be modified');
  }
  
  // Update role
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .update({ name, description, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (roleError) {
    console.error('Error updating role:', roleError);
    throw new Error('Failed to update role');
  }
  
  // Delete existing permissions
  const { error: deleteError } = await supabase
    .from('permissions')
    .delete()
    .eq('role_id', id);
  
  if (deleteError) {
    console.error('Error deleting permissions:', deleteError);
    throw new Error('Failed to update permissions');
  }
  
  // Insert new permissions
  const permissionsToInsert = permissions.map(permission => ({
    role_id: id,
    module_id: permission.module_id,
    can_view: permission.can_view,
    can_create: permission.can_create,
    can_edit: permission.can_edit,
    can_delete: permission.can_delete,
  }));
  
  const { data: insertedPermissions, error: permissionsError } = await supabase
    .from('permissions')
    .insert(permissionsToInsert)
    .select();
  
  if (permissionsError) {
    console.error('Error creating permissions:', permissionsError);
    throw new Error('Failed to update permissions');
  }
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    created_at: role.created_at,
    updated_at: role.updated_at,
    permissions: insertedPermissions,
  };
}

// Delete a role
export async function deleteRole(id: string): Promise<void> {
  const supabase = await getServerSupabaseClient();
  
  // Check if role is predefined
  const { data: existingRole, error: checkError } = await supabase
    .from('roles')
    .select('is_predefined')
    .eq('id', id)
    .single();
  
  if (checkError) {
    console.error('Error checking role:', checkError);
    throw new Error('Failed to check role');
  }
  
  if (existingRole.is_predefined) {
    throw new Error('Predefined roles cannot be deleted');
  }
  
  // Delete role (permissions will be cascade deleted)
  const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting role:', error);
    throw new Error('Failed to delete role');
  }
}

// Check if a user has permission for a specific action on a module
export async function checkPermission(
  userId: string,
  moduleName: string,
  action: 'view' | 'create' | 'edit' | 'delete'
): Promise<boolean> {
  const supabase = await getServerSupabaseClient();
  
  // Get user's role
  const { data: employee, error: employeeError } = await supabase
    .from('employees')
    .select('role_id, is_admin')
    .eq('user_id', userId)
    .single();
  
  if (employeeError) {
    console.error('Error fetching employee:', employeeError);
    return false;
  }
  
  // If user is admin, they have all permissions
  if (employee.is_admin) {
    return true;
  }
  
  // If user has no role, they have no permissions
  if (!employee.role_id) {
    return false;
  }
  
  // Get module ID
  const { data: module, error: moduleError } = await supabase
    .from('modules')
    .select('id')
    .eq('name', moduleName)
    .single();
  
  if (moduleError) {
    console.error('Error fetching module:', moduleError);
    return false;
  }
  
  // Check permission
  const { data: permission, error: permissionError } = await supabase
    .from('permissions')
    .select(`can_${action}`)
    .eq('role_id', employee.role_id)
    .eq('module_id', module.id)
    .single();
  
  if (permissionError) {
    console.error('Error fetching permission:', permissionError);
    return false;
  }
  
  return permission[`can_${action}`] || false;
}
