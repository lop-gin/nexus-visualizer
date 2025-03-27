import { supabase } from '../supabase/client';

export interface ProductUnit {
  unit_type: string;
  unit_name: string;
}

export const fetchProductUnits = async (productId: string): Promise<ProductUnit[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_product_units', { product_id: productId })
      .select();

    if (error) {
      console.error('Error fetching product units:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchProductUnits:', error);
    return [];
  }
};

export const convertUnitQuantity = async (
  productId: string,
  fromUnit: string,
  toUnit: string,
  quantity: number
): Promise<number> => {
  // If converting between the same unit, return the quantity
  if (fromUnit === toUnit) {
    return quantity;
  }

  try {
    // Fetch product details to get conversion factor
    const { data: product, error } = await supabase
      .from('products')
      .select('conversion_factor, primary_unit_of_measure, secondary_unit_of_measure')
      .eq('id', productId)
      .single();

    if (error || !product) {
      console.error('Error fetching product for unit conversion:', error);
      throw error || new Error('Product not found');
    }

    const { conversion_factor, primary_unit_of_measure, secondary_unit_of_measure } = product;

    // If conversion factor is not defined, return the original quantity
    if (!conversion_factor) {
      return quantity;
    }

    // Convert from primary to secondary
    if (fromUnit === primary_unit_of_measure && toUnit === secondary_unit_of_measure) {
      return quantity / conversion_factor;
    }

    // Convert from secondary to primary
    if (fromUnit === secondary_unit_of_measure && toUnit === primary_unit_of_measure) {
      return quantity * conversion_factor;
    }

    // If units don't match product units, return original quantity
    return quantity;
  } catch (error) {
    console.error('Error in convertUnitQuantity:', error);
    return quantity;
  }
};

export const calculateUnitPrice = async (
  productId: string,
  unit: string,
  basePrice: number
): Promise<number> => {
  try {
    // Fetch product details to determine unit type
    const { data: product, error } = await supabase
      .from('products')
      .select('primary_unit_of_measure, secondary_unit_of_measure, conversion_factor')
      .eq('id', productId)
      .single();

    if (error || !product) {
      console.error('Error fetching product for price calculation:', error);
      throw error || new Error('Product not found');
    }

    const { primary_unit_of_measure, secondary_unit_of_measure, conversion_factor } = product;

    // If the selected unit is the secondary unit, adjust price
    if (unit === secondary_unit_of_measure && conversion_factor) {
      return basePrice * conversion_factor;
    }

    // Otherwise, return the base price (for primary unit)
    return basePrice;
  } catch (error) {
    console.error('Error in calculateUnitPrice:', error);
    return basePrice;
  }
};
