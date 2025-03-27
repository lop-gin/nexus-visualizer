'use client';

import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Customer } from '@/types/sales';
import toast from 'react-hot-toast';

// Service functions for customer management
export const useCustomerService = () => {
  const supabase = createClientComponentClient<Database>();
  
  // Fetch all customers for the current company
  const getCustomers = async (): Promise<Customer[]> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
      return [];
    }
  };
  
  // Get a single customer by ID
  const getCustomerById = async (id: string): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error fetching customer:', error);
      toast.error('Failed to load customer details');
      return null;
    }
  };
  
  // Create a new customer
  const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Customer created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating customer:', error);
      toast.error(error.message || 'Failed to create customer');
      return null;
    }
  };
  
  // Update an existing customer
  const updateCustomer = async (id: string, customer: Partial<Customer>): Promise<Customer | null> => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast.success('Customer updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast.error(error.message || 'Failed to update customer');
      return null;
    }
  };
  
  // Delete a customer
  const deleteCustomer = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      toast.success('Customer deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error(error.message || 'Failed to delete customer');
      return false;
    }
  };
  
  return {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
};

export default useCustomerService;
