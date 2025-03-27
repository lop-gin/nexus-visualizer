
import { supabase } from './client';

export interface MigrationResult {
  success: boolean;
  results: any[];
  error?: string;
  message?: string;
}

export const executeSQLMigration = async (sql: string): Promise<MigrationResult> => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error("SQL migration error:", error);
      return {
        success: false,
        results: [],
        error: error.message,
        message: `Error executing migration: ${error.message}`
      };
    }
    
    return {
      success: true,
      results: data || [],
      message: 'Migration executed successfully'
    };
  } catch (error: any) {
    console.error("SQL migration execution error:", error);
    return {
      success: false,
      results: [],
      error: error.message,
      message: `Error executing migration: ${error.message}`
    };
  }
};

export const createRoles = async (): Promise<MigrationResult> => {
  try {
    const { data, error } = await supabase.rpc('insert_predefined_roles');
    
    if (error) {
      return {
        success: false,
        results: [],
        error: error.message,
        message: `Error creating roles: ${error.message}`
      };
    }
    
    return {
      success: true,
      results: [data],
      message: 'Roles created successfully'
    };
  } catch (error: any) {
    return {
      success: false,
      results: [],
      error: error.message,
      message: `Error creating roles: ${error.message}`
    };
  }
};

export const createModules = async (): Promise<MigrationResult> => {
  const modulesSQL = `
    INSERT INTO modules (name, display_name, description)
    VALUES 
      ('dashboard', 'Dashboard', 'System dashboard and overview'),
      ('employees', 'Employees', 'Employee management'),
      ('roles', 'Roles', 'Role and permission management'),
      ('customers', 'Customers', 'Customer management'),
      ('products', 'Products', 'Product management'),
      ('sales', 'Sales', 'Sales management'),
      ('invoices', 'Invoices', 'Invoice management'),
      ('estimates', 'Estimates', 'Estimate management'),
      ('settings', 'Settings', 'System settings')
    ON CONFLICT (name) DO UPDATE SET 
      display_name = EXCLUDED.display_name,
      description = EXCLUDED.description
    RETURNING *;
  `;
  
  return executeSQLMigration(modulesSQL);
};
