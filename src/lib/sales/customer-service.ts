import { supabase } from '@/lib/supabase/client';
import { Customer } from '@/types/sales';

/**
 * Create a new customer
 */
export async function createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<Customer | null> {
  try {
    // Format the data to ensure null values are not sent as undefined
    const formattedData = {
      name: customerData.name,
      email: customerData.email || null,
      phone: customerData.phone || null,
      address: customerData.address || null,
      company: customerData.company || null,
      billing_address: customerData.billing_address || null
    };

    const { data, error } = await supabase
      .from('customers')
      .insert(formattedData)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating customer:', error);
    return null;
  }
}

/**
 * Fetch all customers
 */
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

/**
 * Fetch a customer by ID
 */
export async function fetchCustomerById(id: string): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating customer:', error);
    return null;
  }
}

/**
 * Delete a customer by ID
 */
export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
}
