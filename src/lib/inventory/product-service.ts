import { supabase } from '@/lib/supabase/client';
import { Product, Category } from '@/types/inventory';

/**
 * Fetch all products
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetch a product by ID
 */
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

/**
 * Create a new product
 */
export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

/**
 * Fetch all product categories
 */
export async function fetchCategories(): Promise<Category[]> {
  // If categories table doesn't exist in your Supabase, return mock data
  return [
    { id: "1", name: "Raw Materials", description: "Basic materials used in manufacturing" },
    { id: "2", name: "Finished Goods", description: "Completed products ready for sale" },
    { id: "3", name: "Packaging", description: "Materials used for packaging products" },
  ];
}
