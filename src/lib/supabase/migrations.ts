
import { supabase } from './client';
import { createRolesTable, createModulesTable, createPermissionsTable, createEmployeesTable, createCompaniesTable, createInvitationsTable, insertPredefinedRoles } from './schema';

// Function to create roles table and insert predefined roles
export const createRoles = async () => {
  try {
    // Execute SQL to create roles table
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createRolesTable
    });
    
    if (createError) {
      throw createError;
    }
    
    // Execute SQL to insert predefined roles
    const { data: insertResult, error: insertError } = await supabase.rpc('exec_sql', {
      sql_query: insertPredefinedRoles
    });
    
    if (insertError) {
      throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating roles:', error);
    return { success: false, error };
  }
};

// Function to create modules table and insert default modules
export const createModules = async () => {
  try {
    // Execute SQL to create modules table
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createModulesTable
    });
    
    if (createError) {
      throw createError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating modules:', error);
    return { success: false, error };
  }
};

// Function to create permissions table
export const createPermissions = async () => {
  try {
    // Execute SQL to create permissions table
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createPermissionsTable
    });
    
    if (createError) {
      throw createError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating permissions:', error);
    return { success: false, error };
  }
};

// Function to create companies table
export const createCompanies = async () => {
  try {
    // Execute SQL to create companies table
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createCompaniesTable
    });
    
    if (createError) {
      throw createError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating companies:', error);
    return { success: false, error };
  }
};

// Function to create employees table
export const createEmployees = async () => {
  try {
    // Execute SQL to create employees table
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createEmployeesTable
    });
    
    if (createError) {
      throw createError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating employees:', error);
    return { success: false, error };
  }
};

// Function to create invitations table
export const createInvitations = async () => {
  try {
    // Execute SQL to create invitations table
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql_query: createInvitationsTable
    });
    
    if (createError) {
      throw createError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating invitations:', error);
    return { success: false, error };
  }
};

// Function to create company and admin record
export const createCompanyAndAdmin = async (
  userId: string,
  companyName: string,
  companyType: 'manufacturer' | 'distributor' | 'both',
  fullName: string,
  email: string
) => {
  try {
    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: companyName,
        type: companyType,
      })
      .select()
      .single();
    
    if (companyError) {
      throw companyError;
    }
    
    // Get admin role ID
    const { data: adminRole, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'Admin')
      .single();
    
    if (roleError) {
      throw roleError;
    }
    
    // Create employee record for the admin
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        user_id: userId,
        full_name: fullName,
        email: email,
        company_id: company.id,
        role_id: adminRole.id,
        is_admin: true,
        status: 'active',
      })
      .select()
      .single();
    
    if (employeeError) {
      throw employeeError;
    }
    
    return { success: true, company, employee };
  } catch (error) {
    console.error('Error creating company and admin:', error);
    throw error;
  }
};
