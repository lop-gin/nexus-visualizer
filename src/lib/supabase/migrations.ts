import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

/**
 * Execute SQL migration script
 */
export async function executeSQLMigration(sqlScript: string) {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    let results = [];
    
    // Execute each statement
    for (const statement of statements) {
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: statement + ';'
      });
      
      if (error) throw error;
      
      results.push(data);
    }
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Error executing SQL migration:', error);
    throw error;
  }
}

/**
 * Create a new company and admin account
 */
export async function createCompanyAndAdmin(
  userId: string,
  companyName: string,
  companyType: 'manufacturer' | 'distributor' | 'both',
  fullName: string,
  email: string
) {
  const supabase = createClientComponentClient<Database>();
  
  try {
    // Start a transaction
    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        type: companyType,
        email: email
      })
      .select('id')
      .single();
      
    if (companyError) throw companyError;
    if (!company) throw new Error('Failed to create company');
    
    // Get admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'Admin')
      .single();
      
    if (roleError) throw roleError;
    if (!adminRole) throw new Error('Admin role not found');
    
    // Create employee record for the admin
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        user_id: userId,
        company_id: company.id,
        full_name: fullName,
        email: email,
        is_admin: true,
        role_id: adminRole.id,
        status: 'active'
      })
      .select()
      .single();
      
    if (employeeError) throw employeeError;
    
    return {
      company,
      employee
    };
  } catch (error) {
    console.error('Error creating company and admin:', error);
    throw error;
  }
}
