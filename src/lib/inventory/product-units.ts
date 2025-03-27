import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Product } from '@/types/inventory';

// Function to get product units for dropdown
export const getProductUnits = async (productId: string) => {
  const supabase = createClientComponentClient<Database>();
  
  try {
    const { data, error } = await supabase
      .rpc('get_product_units', { product_id: parseInt(productId) });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching product units:', error);
    return [];
  }
};

// Function to get product details including units
export const getProductDetails = async (productId: string): Promise<Product | null> => {
  const supabase = createClientComponentClient<Database>();
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
};

// Function to convert between units
export const convertBetweenUnits = (
  quantity: number, 
  fromUnitType: 'primary' | 'secondary', 
  toUnitType: 'primary' | 'secondary', 
  conversionFactor: number
): number => {
  if (fromUnitType === toUnitType) {
    return quantity;
  }
  
  if (fromUnitType === 'primary' && toUnitType === 'secondary') {
    return quantity / conversionFactor;
  }
  
  if (fromUnitType === 'secondary' && toUnitType === 'primary') {
    return quantity * conversionFactor;
  }
  
  return quantity;
};

// Function to format unit display
export const formatUnitDisplay = (unitName: string, quantity: number): string => {
  return `${quantity} ${unitName}${quantity !== 1 ? 's' : ''}`;
};

// Function to get unit price based on selected unit
export const getUnitPrice = (
  defaultUnitPrice: number,
  selectedUnitType: 'primary' | 'secondary',
  conversionFactor: number
): number => {
  if (selectedUnitType === 'primary') {
    return defaultUnitPrice;
  } else {
    return defaultUnitPrice * conversionFactor;
  }
};
