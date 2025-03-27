import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { DbEmployee } from '@/lib/supabase/schema';
import { Employee } from '@/types/auth';

// Create a Supabase client for server components
export async function getServerSupabaseClient() {
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
}

// Fetch all employees for the current user's company
export async function fetchEmployees(): Promise<Employee[]> {
  const supabase = await getServerSupabaseClient();
  
  // Get current user's company
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  const { data: currentEmployee, error: employeeError } = await supabase
    .from('employees')
    .select('company_id')
    .eq('user_id', session.user.id)
    .single();
  
  if (employeeError) {
    console.error('Error fetching current employee:', employeeError);
    throw new Error('Failed to fetch company information');
  }
  
  // Fetch employees for this company
  const { data: employees, error } = await supabase
    .from('employees')
    .select(`
      *,
      role:role_id(id, name, description)
    `)
    .eq('company_id', currentEmployee.company_id)
    .order('full_name');
  
  if (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Failed to fetch employees');
  }
  
  return employees.map((employee: any) => ({
    id: employee.id,
    full_name: employee.full_name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    company_name: employee.company_name,
    company_type: employee.company_type,
    role_id: employee.role_id,
    role: employee.role,
    is_admin: employee.is_admin,
    status: employee.status,
    created_at: employee.created_at,
    updated_at: employee.updated_at,
  }));
}

// Fetch a single employee by ID
export async function fetchEmployeeById(id: string): Promise<Employee | null> {
  const supabase = await getServerSupabaseClient();
  
  // Get current user's company
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  const { data: currentEmployee, error: employeeError } = await supabase
    .from('employees')
    .select('company_id')
    .eq('user_id', session.user.id)
    .single();
  
  if (employeeError) {
    console.error('Error fetching current employee:', employeeError);
    throw new Error('Failed to fetch company information');
  }
  
  // Fetch employee
  const { data: employee, error } = await supabase
    .from('employees')
    .select(`
      *,
      role:role_id(id, name, description)
    `)
    .eq('id', id)
    .eq('company_id', currentEmployee.company_id)
    .single();
  
  if (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
  
  return {
    id: employee.id,
    full_name: employee.full_name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    company_name: employee.company_name,
    company_type: employee.company_type,
    role_id: employee.role_id,
    role: employee.role,
    is_admin: employee.is_admin,
    status: employee.status,
    created_at: employee.created_at,
    updated_at: employee.updated_at,
  };
}

// Create a new employee
export async function createEmployee(
  full_name: string,
  email: string,
  phone: string | null,
  role_id: string,
  is_admin: boolean = false
): Promise<Employee> {
  const supabase = await getServerSupabaseClient();
  
  // Get current user's company
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  const { data: currentEmployee, error: employeeError } = await supabase
    .from('employees')
    .select('company_id, is_admin')
    .eq('user_id', session.user.id)
    .single();
  
  if (employeeError) {
    console.error('Error fetching current employee:', employeeError);
    throw new Error('Failed to fetch company information');
  }
  
  // Check if user has admin privileges
  if (!currentEmployee.is_admin) {
    throw new Error('Only admins can create employees');
  }
  
  // Create employee
  const { data: employee, error } = await supabase
    .from('employees')
    .insert({
      full_name,
      email,
      phone,
      company_id: currentEmployee.company_id,
      role_id,
      is_admin,
      status: 'invited',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating employee:', error);
    throw new Error('Failed to create employee');
  }
  
  return {
    id: employee.id,
    full_name: employee.full_name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    company_name: employee.company_name,
    company_type: employee.company_type,
    role_id: employee.role_id,
    is_admin: employee.is_admin,
    status: employee.status,
    created_at: employee.created_at,
    updated_at: employee.updated_at,
  };
}

// Update an existing employee
export async function updateEmployee(
  id: string,
  full_name: string,
  email: string,
  phone: string | null,
  role_id: string,
  is_admin: boolean = false
): Promise<Employee> {
  const supabase = await getServerSupabaseClient();
  
  // Get current user's company
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  const { data: currentEmployee, error: employeeError } = await supabase
    .from('employees')
    .select('company_id, is_admin')
    .eq('user_id', session.user.id)
    .single();
  
  if (employeeError) {
    console.error('Error fetching current employee:', employeeError);
    throw new Error('Failed to fetch company information');
  }
  
  // Check if user has admin privileges
  if (!currentEmployee.is_admin) {
    throw new Error('Only admins can update employees');
  }
  
  // Update employee
  const { data: employee, error } = await supabase
    .from('employees')
    .update({
      full_name,
      email,
      phone,
      role_id,
      is_admin,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('company_id', currentEmployee.company_id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating employee:', error);
    throw new Error('Failed to update employee');
  }
  
  return {
    id: employee.id,
    full_name: employee.full_name,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    company_name: employee.company_name,
    company_type: employee.company_type,
    role_id: employee.role_id,
    is_admin: employee.is_admin,
    status: employee.status,
    created_at: employee.created_at,
    updated_at: employee.updated_at,
  };
}

// Delete an employee
export async function deleteEmployee(id: string): Promise<void> {
  const supabase = await getServerSupabaseClient();
  
  // Get current user's company
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  const { data: currentEmployee, error: employeeError } = await supabase
    .from('employees')
    .select('company_id, is_admin')
    .eq('user_id', session.user.id)
    .single();
  
  if (employeeError) {
    console.error('Error fetching current employee:', employeeError);
    throw new Error('Failed to fetch company information');
  }
  
  // Check if user has admin privileges
  if (!currentEmployee.is_admin) {
    throw new Error('Only admins can delete employees');
  }
  
  // Delete employee
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id)
    .eq('company_id', currentEmployee.company_id);
  
  if (error) {
    console.error('Error deleting employee:', error);
    throw new Error('Failed to delete employee');
  }
}

// Create and send invitation to an employee
export async function inviteEmployee(
  employeeId: string
): Promise<void> {
  const supabase = await getServerSupabaseClient();
  
  // Get current user's company and the employee
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  
  const { data: currentEmployee, error: employeeError } = await supabase
    .from('employees')
    .select('company_id, is_admin')
    .eq('user_id', session.user.id)
    .single();
  
  if (employeeError) {
    console.error('Error fetching current employee:', employeeError);
    throw new Error('Failed to fetch company information');
  }
  
  // Check if user has admin privileges
  if (!currentEmployee.is_admin) {
    throw new Error('Only admins can send invitations');
  }
  
  // Get employee details
  const { data: employee, error: fetchError } = await supabase
    .from('employees')
    .select('email, role_id')
    .eq('id', employeeId)
    .eq('company_id', currentEmployee.company_id)
    .single();
  
  if (fetchError) {
    console.error('Error fetching employee:', fetchError);
    throw new Error('Failed to fetch employee information');
  }
  
  // Generate invitation token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  // Set expiration date (48 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48);
  
  // Create invitation
  const { error: inviteError } = await supabase
    .from('invitations')
    .insert({
      email: employee.email,
      company_id: currentEmployee.company_id,
      role_id: employee.role_id,
      invited_by: session.user.id,
      token,
      expires_at: expiresAt.toISOString(),
      status: 'pending',
    });
  
  if (inviteError) {
    console.error('Error creating invitation:', inviteError);
    throw new Error('Failed to create invitation');
  }
  
  // In a real implementation, we would send an email to the employee with the invitation link
  // For now, we'll just update the employee status
  const { error: updateError } = await supabase
    .from('employees')
    .update({
      status: 'invited',
      updated_at: new Date().toISOString(),
    })
    .eq('id', employeeId)
    .eq('company_id', currentEmployee.company_id);
  
  if (updateError) {
    console.error('Error updating employee status:', updateError);
    throw new Error('Failed to update employee status');
  }
}
