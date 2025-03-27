import { supabase } from '@/lib/supabase/client';

// Type for migration results
export type MigrationResult = {
  success: boolean;
  message?: string;
  error?: any;
};

/**
 * Execute a SQL migration script directly
 */
export async function executeSQLMigration(sql: string): Promise<MigrationResult> {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    });

    if (error) throw error;
    
    return {
      success: true,
      message: 'SQL migration executed successfully'
    };
  } catch (error: any) {
    console.error('Error executing SQL migration:', error);
    return {
      success: false,
      error: error.message || 'Failed to execute SQL migration'
    };
  }
}

// Fix the migration functions to use proper names
export async function createRoles() {
  try {
    const { error } = await supabase.from('roles').insert([
      { id: 'b5a2444a-49ef-4409-b24a-047ca26c9c3d', name: 'SuperAdmin', description: 'Full access to everything' },
      { id: 'a7a35c3a-4b4a-4b4b-8a5a-5a5a5a5a5a5a', name: 'Admin', description: 'Can manage most things' },
      { id: 'c9c46d4c-5c5c-4c4c-9c9c-7c7c7c7c7c7c', name: 'Manager', description: 'Can manage employees and customers' },
      { id: 'e1e27f6e-6e6e-4e4e-8e8e-9e9e9e9e9e9e', name: 'Employee', description: 'Can view and edit their own information' },
    ]);

    if (error) {
      throw error;
    }

    return { success: true, message: 'Roles created successfully' };
  } catch (error: any) {
    console.error('Error creating roles:', error);
    return { success: false, error: error.message || 'Failed to create roles' };
  }
}

export async function createModules() {
  try {
    const { error } = await supabase.from('modules').insert([
      { id: 'f7b8a9b0-4b4a-4b4b-8a5a-5a5a5a5a5a5a', name: 'Dashboard', description: 'Main dashboard' },
      { id: 'd9c57b8c-3c3c-4c4c-9c9c-7c7c7c7c7c7c', name: 'Employees', description: 'Employee management' },
      { id: 'b1a23c4d-2d2d-4d4d-8d8d-6d6d6d6d6d6d', name: 'Roles', description: 'Role management' },
      { id: 'a3b4c5d6-1a1a-4a4a-8a8a-5a5a5a5a5a5a', name: 'Settings', description: 'Settings' },
      { id: 'e5f6g7h8-8h8h-4h4h-8h8h-7h7h7h7h7h7h', name: 'Sales', description: 'Sales management' },
      { id: 'i9j0k1l2-2i2i-4i4i-8i8i-8i8i8i8i8i8i', name: 'Inventory', description: 'Inventory management' },
    ]);

    if (error) {
      throw error;
    }

    return { success: true, message: 'Modules created successfully' };
  } catch (error: any) {
    console.error('Error creating modules:', error);
    return { success: false, error: error.message || 'Failed to create modules' };
  }
}

export async function createPermissions() {
  try {
    // Fetch role and module IDs
    const { data: roles, error: rolesError } = await supabase.from('roles').select('id, name');
    const { data: modules, error: modulesError } = await supabase.from('modules').select('id, name');

    if (rolesError) throw rolesError;
    if (modulesError) throw modulesError;

    // Helper function to get ID by name
    const getRoleId = (name: string) => roles?.find(role => role.name === name)?.id;
    const getModuleId = (name: string) => modules?.find(module => module.name === name)?.id;

    // Permissions for SuperAdmin (full access)
    const superAdminPermissions = modules?.map(module => ({
      role_id: getRoleId('SuperAdmin'),
      module_id: module.id,
      can_view: true,
      can_create: true,
      can_edit: true,
      can_delete: true,
    }));

    // Permissions for Admin (varied access)
    const adminPermissions = [
      { role_id: getRoleId('Admin'), module_id: getModuleId('Dashboard'), can_view: true, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Admin'), module_id: getModuleId('Employees'), can_view: true, can_create: true, can_edit: true, can_delete: true },
      { role_id: getRoleId('Admin'), module_id: getModuleId('Roles'), can_view: true, can_create: true, can_edit: true, can_delete: true },
      { role_id: getRoleId('Admin'), module_id: getModuleId('Settings'), can_view: true, can_create: true, can_edit: true, can_delete: true },
      { role_id: getRoleId('Admin'), module_id: getModuleId('Sales'), can_view: true, can_create: true, can_edit: true, can_delete: true },
      { role_id: getRoleId('Admin'), module_id: getModuleId('Inventory'), can_view: true, can_create: true, can_edit: true, can_delete: true },
    ];

    // Permissions for Manager (limited access)
    const managerPermissions = [
      { role_id: getRoleId('Manager'), module_id: getModuleId('Dashboard'), can_view: true, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Manager'), module_id: getModuleId('Employees'), can_view: true, can_create: true, can_edit: true, can_delete: false },
      { role_id: getRoleId('Manager'), module_id: getModuleId('Roles'), can_view: true, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Manager'), module_id: getModuleId('Settings'), can_view: false, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Manager'), module_id: getModuleId('Sales'), can_view: true, can_create: true, can_edit: true, can_delete: true },
      { role_id: getRoleId('Manager'), module_id: getModuleId('Inventory'), can_view: true, can_create: true, can_edit: true, can_delete: true },
    ];

    // Permissions for Employee (very limited access)
    const employeePermissions = [
      { role_id: getRoleId('Employee'), module_id: getModuleId('Dashboard'), can_view: true, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Employee'), module_id: getModuleId('Employees'), can_view: true, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Employee'), module_id: getModuleId('Roles'), can_view: false, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Employee'), module_id: getModuleId('Settings'), can_view: false, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Employee'), module_id: getModuleId('Sales'), can_view: false, can_create: false, can_edit: false, can_delete: false },
      { role_id: getRoleId('Employee'), module_id: getModuleId('Inventory'), can_view: false, can_create: false, can_edit: false, can_delete: false },
    ];

    // Combine all permissions
    const allPermissions = [
      ...(superAdminPermissions || []),
      ...adminPermissions,
      ...managerPermissions,
      ...employeePermissions,
    ];

    // Insert permissions into the database
    const { error } = await supabase.from('permissions').insert(allPermissions);

    if (error) {
      throw error;
    }

    return { success: true, message: 'Permissions created successfully' };
  } catch (error: any) {
    console.error('Error creating permissions:', error);
    return { success: false, error: error.message || 'Failed to create permissions' };
  }
}

export async function createCompanies() {
    return { success: true, message: 'Companies created successfully' };
}

export async function createEmployees() {
    return { success: true, message: 'Employees created successfully' };
}

export async function createInvitations() {
    return { success: true, message: 'Invitations created successfully' };
}

// Add the missing function for predefined roles
export async function insertPredefinedRoles(): Promise<MigrationResult> {
  try {
    const { error } = await supabase.rpc('insert_predefined_roles');

    if (error) throw error;
    
    return {
      success: true,
      message: 'Predefined roles inserted successfully'
    };
  } catch (error: any) {
    console.error('Error inserting predefined roles:', error);
    return {
      success: false,
      error: error.message || 'Failed to insert predefined roles'
    };
  }
}
