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
export async function inviteEmployee(employeeId: string): Promise<any> {
  try {
    // Fetch employee data first to get their email
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();
    
    if (fetchError) throw fetchError;
    if (!employee) throw new Error('Employee not found');
    
    // Mark employee as invited
    const { data: updatedEmployee, error: updateError } = await supabase
      .from('employees')
      .update({ 
        invitation_sent: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', employeeId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // In a real implementation, this would also call an API to send the invitation email
    // For now, we just mark the employee as invited and return success
    
    return updatedEmployee;
  } catch (error) {
    console.error('Error inviting employee:', error);
    throw error;
  }
}
