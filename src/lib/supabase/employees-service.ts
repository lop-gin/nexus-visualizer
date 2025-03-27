import { supabase } from '@/lib/supabase/client';

/**
 * Fetch all employees for a specific company
 */
export async function fetchEmployees(companyId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('company_id', companyId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

/**
 * Fetch an employee by ID
 */
export async function fetchEmployeeById(id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
}

/**
 * Create a new employee
 */
export async function createEmployee(employeeData: any): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([employeeData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating employee:', error);
    return null;
  }
}

/**
 * Update an existing employee
 */
export async function updateEmployee(id: string, updates: any): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating employee:', error);
    return null;
  }
}

/**
 * Delete an employee by ID
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
}

/**
 * Invite an employee by sending them an invitation email
 */
export async function inviteEmployee(employeeId: string) {
  try {
    const supabase = createClientComponentClient<Database>();
    
    // First, get the employee details
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();
    
    if (fetchError || !employee) {
      throw fetchError || new Error('Employee not found');
    }
    
    // Update the employee to mark invitation as sent
    const { data: updatedEmployee, error: updateError } = await supabase
      .from('employees')
      .update({ invitation_sent: true })
      .eq('id', employeeId)
      .select('*')
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    // In a real app, we would send an email invitation here
    // For now, just return the updated employee
    return updatedEmployee;
  } catch (error) {
    console.error('Error inviting employee:', error);
    throw error;
  }
}

/**
 * Send invitation to a newly created employee
 * @param email Employee email
 * @param full_name Employee full name
 * @param role_id Employee role ID
 * @param company_id Company ID
 * @param is_admin Whether the employee is an admin
 */
export async function sendEmployeeInvitation(
  email: string,
  full_name: string,
  role_id: string | null,
  company_id: string,
  is_admin: boolean
) {
  // In a real app, send an email invitation to the employee
  console.log(`Sending invitation to ${email} (${full_name})`);
  
  // For now, just return a success message
  return {
    email,
    full_name,
    success: true,
    message: `Invitation sent to ${email}`,
  };
}
