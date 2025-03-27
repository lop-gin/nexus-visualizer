
import { supabase } from '../supabase/client';
import { Customer } from '@/types/sales';

export const fetchCustomerById = async (id: string): Promise<Customer | null> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchCustomerById:', error);
    return null;
  }
};

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchCustomers:', error);
    return [];
  }
};

export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; customer?: Customer; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert(customer)
      .select()
      .single();

    if (error) throw error;

    return { success: true, customer: data };
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create customer' 
    };
  }
};

export const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<{ success: boolean; error?: string }> => {
  try {
    // Prepare the update object to ensure proper types
    const customerToUpdate = {
      ...customer,
      // Ensure created_at isn't null
      created_at: customer.created_at || undefined,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('customers')
      .update(customerToUpdate)
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update customer' 
    };
  }
};

export const deleteCustomer = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete customer' 
    };
  }
};
