import { supabase } from '../supabase/client';

export type AllowedTable = 
  | 'employees' 
  | 'companies' 
  | 'roles' 
  | 'invitations' 
  | 'modules' 
  | 'permissions' 
  | 'products' 
  | 'transactions' 
  | 'transaction_items' 
  | 'customers'
  | 'categories';

export const fetchOne = async <T extends Record<string, any>>(
  table: AllowedTable,
  id: string
): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return null;
    }

    // Type assertion to convert to the generic type
    return data as unknown as T;
  } catch (error) {
    console.error(`Error in fetchOne for ${table}:`, error);
    return null;
  }
};

export const fetchAll = async <T extends Record<string, any>>(
  table: AllowedTable
): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');

    if (error) {
      console.error(`Error fetching all ${table}:`, error);
      return [];
    }

    // Type assertion to convert to the generic type array
    return data as unknown as T[];
  } catch (error) {
    console.error(`Error in fetchAll for ${table}:`, error);
    return [];
  }
};

export const insert = async <T extends Record<string, any>>(
  table: AllowedTable,
  record: Omit<T, 'id' | 'created_at' | 'updated_at'>
): Promise<T | null> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      return null;
    }

    // Type assertion to convert to the generic type
    return data as unknown as T;
  } catch (error) {
    console.error(`Error in insert for ${table}:`, error);
    return null;
  }
};

export const update = async <T extends Record<string, any>>(
  table: AllowedTable,
  id: string,
  updates: Partial<T>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(table)
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error(`Error updating ${table}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in update for ${table}:`, error);
    return false;
  }
};

export const remove = async (
  table: AllowedTable,
  id: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in remove for ${table}:`, error);
    return false;
  }
};

// For company data isolation, we need to add the company ID to all queries
// This would be implemented in a real application with Row Level Security in Supabase
