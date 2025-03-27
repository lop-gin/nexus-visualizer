
import { supabase } from '@/lib/supabase/client';
import { Employee } from '@/types/auth';

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        role:role_id(id, name, description, is_predefined)
      `)
      .order('full_name');
    
    if (error) {
      throw error;
    }
    
    // Transform data to match our Employee type
    return data.map(emp => ({
      id: emp.id,
      full_name: emp.full_name,
      email: emp.email,
      phone: emp.phone,
      address: emp.address,
      company_id: emp.company_id,
      role_id: emp.role_id,
      role: emp.role,
      is_admin: emp.is_admin,
      status: emp.status as "active" | "inactive" | "invited",
      created_at: emp.created_at,
      updated_at: emp.updated_at,
      user_id: emp.user_id,
      invitation_sent: emp.invitation_sent || false,
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const fetchEmployeeById = async (employeeId: string): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        role:role_id(id, name, description, is_predefined)
      `)
      .eq('id', employeeId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Transform data to match our Employee type
    return {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      company_id: data.company_id,
      role_id: data.role_id,
      role: data.role,
      is_admin: data.is_admin,
      status: data.status as "active" | "inactive" | "invited",
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      invitation_sent: data.invitation_sent || false,
    };
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    throw error;
  }
};

export const createEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>, sendInvite: boolean = false): Promise<Employee> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert({
        full_name: employee.full_name,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        company_id: employee.company_id,
        role_id: employee.role_id,
        is_admin: employee.is_admin,
        status: 'invited',
        invitation_sent: sendInvite,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transform data to match our Employee type
    const newEmployee: Employee = {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      company_id: data.company_id,
      role_id: data.role_id,
      is_admin: data.is_admin,
      status: data.status as "active" | "inactive" | "invited",
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      invitation_sent: data.invitation_sent || false,
    };
    
    return newEmployee;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

export const updateEmployee = async (employeeId: string, updates: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>): Promise<Employee> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', employeeId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Transform data to match our Employee type
    const updatedEmployee: Employee = {
      id: data.id,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      company_id: data.company_id,
      role_id: data.role_id,
      is_admin: data.is_admin,
      status: data.status as "active" | "inactive" | "invited",
      created_at: data.created_at,
      updated_at: data.updated_at,
      user_id: data.user_id,
      invitation_sent: data.invitation_sent || false,
    };
    
    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

export const deleteEmployee = async (employeeId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', employeeId);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

export const sendEmployeeInvitation = async (employeeId: string): Promise<Employee> => {
  try {
    // First get the employee
    const employee = await fetchEmployeeById(employeeId);
    
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // TODO: Send invitation email
    
    // Update employee to mark invitation as sent
    const updatedEmployee = await updateEmployee(employeeId, {
      invitation_sent: true,
    });
    
    return updatedEmployee;
  } catch (error) {
    console.error('Error sending employee invitation:', error);
    throw error;
  }
};
