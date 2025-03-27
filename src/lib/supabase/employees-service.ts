import { supabase } from './client';
import { Employee } from '@/types/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/integrations/supabase/types';

export const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        role:roles(id, name, description)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchEmployeeById:', error);
    return null;
  }
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        role:roles(id, name, description)
      `)
      .order('full_name');

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchEmployees:', error);
    return [];
  }
};

export const updateEmployeeStatus = async (id: string, status: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('employees')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating employee status:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update employee status' 
    };
  }
};

export const inviteEmployee = async (
  email: string,
  fullName: string,
  roleId: string | null,
  isAdmin: boolean
): Promise<{ success: boolean; error?: string; id?: string }> => {
  try {
    // First check if employee with this email already exists
    const { data: existingEmployee } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existingEmployee) {
      return {
        success: false,
        error: 'An employee with this email already exists'
      };
    }

    // Get the company ID for the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('Failed to get current user');
    }

    // Get the company ID
    const { data: companyData, error: companyError } = await supabase
      .from('employees')
      .select('company_id')
      .eq('user_id', userData.user.id)
      .single();

    if (companyError || !companyData) {
      throw new Error('Failed to get company ID');
    }

    // Create the employee record
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert({
        full_name: fullName,
        email: email,
        status: 'invited',
        is_admin: isAdmin,
        role_id: roleId || null,
        company_id: companyData.company_id,
        invitation_sent: true
      })
      .select()
      .single();

    if (employeeError) {
      throw employeeError;
    }

    // Create an invitation
    const { error: invitationError } = await supabase
      .from('invitations')
      .insert({
        email: email,
        employee_id: employee.id,
        company_id: companyData.company_id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      });

    if (invitationError) {
      throw invitationError;
    }

    // In a real application, you would send an email here
    console.log(`Invitation sent to ${email}`);

    return {
      success: true,
      id: employee.id
    };
  } catch (error: any) {
    console.error('Error inviting employee:', error);
    return {
      success: false,
      error: error.message || 'Failed to invite employee'
    };
  }
};

export const updateEmployee = async (
  id: string,
  updates: Partial<Employee>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('employees')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update employee' 
    };
  }
};

export const deleteEmployee = async (
  id: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // First check if this employee has a user account
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // If the employee has a user account, we can't delete them
    if (employee.user_id) {
      return {
        success: false,
        error: 'Cannot delete an employee with an active user account'
      };
    }

    // Delete the employee
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete employee' 
    };
  }
};

export const acceptInvitation = async (
  invitationId: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .single();

    if (invitationError || !invitation) {
      throw new Error('Invitation not found or has expired');
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      throw new Error('Invitation has expired');
    }

    // Create a user account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: invitation.email,
      password: password,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Failed to create user account');
    }

    // Update the employee record
    const { error: employeeError } = await supabase
      .from('employees')
      .update({
        user_id: authData.user.id,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.employee_id);

    if (employeeError) {
      throw employeeError;
    }

    // Delete the invitation
    const { error: deleteError } = await supabase
      .from('invitations')
      .delete()
      .eq('id', invitationId);

    if (deleteError) {
      console.error('Error deleting invitation:', deleteError);
      // Not throwing here as the main operation succeeded
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error accepting invitation:', error);
    return {
      success: false,
      error: error.message || 'Failed to accept invitation'
    };
  }
};
