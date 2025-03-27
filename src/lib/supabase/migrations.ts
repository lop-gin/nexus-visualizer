import { supabase } from '@/integrations/supabase/client';
import fs from 'fs';
import path from 'path';

// Function to check if database is initialized
export async function isDatabaseInitialized() {
  try {
    // Check if companies table exists
    const { count, error } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') { // Table doesn't exist
      return false;
    } else if (error) {
      console.error('Error checking database:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in isDatabaseInitialized:', error);
    return false;
  }
}

// Function to execute SQL migrations
export async function executeMigrations() {
  try {
    // Get SQL content from the file
    const sqlPath = path.join(process.cwd(), 'src', 'lib', 'supabase', 'migrations', 'create_tables.sql');
    const sqlContent = fs.existsSync(sqlPath) ? fs.readFileSync(sqlPath, 'utf8') : '';
    
    if (!sqlContent) {
      console.error('SQL file not found or empty');
      return { success: false, error: 'SQL file not found or empty' };
    }
    
    // Execute the SQL using a custom function (this will depend on your Supabase setup)
    // Note: This typically requires a Supabase function to be defined
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('Error executing migrations:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in executeMigrations:', error);
    return { success: false, error: error.message };
  }
}

// Function to initialize database
export async function initializeDatabase() {
  try {
    const isInitialized = await isDatabaseInitialized();
    
    if (!isInitialized) {
      const result = await executeMigrations();
      return result;
    }
    
    return { success: true, message: 'Database already initialized' };
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return { success: false, error: error.message };
  }
}

// Function to create a new company and admin user during signup
export async function createCompanyAndAdmin(
  userId: string,
  companyName: string,
  companyType: 'manufacturer' | 'distributor' | 'both',
  fullName: string,
  email: string,
  phone?: string,
  address?: string
) {
  try {
    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        type: companyType,
        phone,
        email,
        address,
      })
      .select()
      .single();
    
    if (companyError) {
      console.error('Error creating company:', companyError);
      throw new Error('Failed to create company');
    }
    
    // Get Admin role
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'Admin')
      .single();
    
    if (roleError) {
      console.error('Error fetching admin role:', roleError);
      throw new Error('Failed to fetch admin role');
    }
    
    // Create employee record for admin
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        user_id: userId,
        full_name: fullName,
        email,
        phone,
        address,
        company_id: company.id,
        role_id: adminRole.id,
        is_admin: true,
        status: 'active',
      })
      .select()
      .single();
    
    if (employeeError) {
      console.error('Error creating employee:', employeeError);
      throw new Error('Failed to create employee record');
    }
    
    return { company, employee };
  } catch (error: any) {
    console.error('Error in createCompanyAndAdmin:', error);
    throw error;
  }
}
