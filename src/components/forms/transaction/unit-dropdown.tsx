'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { Product } from '@/types/inventory';
import { getProductUnits, convertBetweenUnits, getUnitPrice } from '@/lib/inventory/product-units';
import toast from 'react-hot-toast';

// Component for unit of measure dropdown in transaction forms
export const UnitOfMeasureDropdown = ({ 
  productId, 
  value, 
  onChange,
  onUnitPriceChange,
  defaultUnitPrice
}: { 
  productId: string | null; 
  value: string;
  onChange: (value: string, unitType: 'primary' | 'secondary') => void;
  onUnitPriceChange?: (price: number) => void;
  defaultUnitPrice?: number;
}) => {
  const [units, setUnits] = React.useState<{unit_type: string; unit_name: string}[]>([]);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  React.useEffect(() => {
    const fetchUnits = async () => {
      if (!productId) {
        setUnits([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch product details to get conversion factor
        const supabase = createClientComponentClient<Database>();
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
          
        if (productError) {
          throw productError;
        }
        
        setProduct(productData);
        
        // Fetch available units
        const unitsData = await getProductUnits(productId);
        setUnits(unitsData);
        
        // If no unit is selected yet and we have units, select the first one
        if ((!value || value === '') && unitsData.length > 0) {
          onChange(unitsData[0].unit_name, unitsData[0].unit_type as 'primary' | 'secondary');
          
          // Update unit price if needed
          if (onUnitPriceChange && defaultUnitPrice && productData) {
            const newUnitPrice = getUnitPrice(
              defaultUnitPrice,
              unitsData[0].unit_type as 'primary' | 'secondary',
              productData.conversion_factor || 1
            );
            onUnitPriceChange(newUnitPrice);
          }
        }
      } catch (error) {
        console.error('Error fetching units:', error);
        toast.error('Failed to load units of measure');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnits();
  }, [productId, value, onChange, onUnitPriceChange, defaultUnitPrice]);
  
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUnitName = e.target.value;
    const selectedUnit = units.find(unit => unit.unit_name === selectedUnitName);
    
    if (selectedUnit) {
      onChange(selectedUnit.unit_name, selectedUnit.unit_type as 'primary' | 'secondary');
      
      // Update unit price if needed
      if (onUnitPriceChange && defaultUnitPrice && product) {
        const newUnitPrice = getUnitPrice(
          defaultUnitPrice,
          selectedUnit.unit_type as 'primary' | 'secondary',
          product.conversion_factor || 1
        );
        onUnitPriceChange(newUnitPrice);
      }
    }
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Unit of Measure
      </label>
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'bg-gray-100' : ''}`}
        value={value}
        onChange={handleUnitChange}
        disabled={isLoading || !productId || units.length === 0}
      >
        {!productId ? (
          <option value="">Select a product first</option>
        ) : isLoading ? (
          <option value="">Loading units...</option>
        ) : units.length === 0 ? (
          <option value="">No units available</option>
        ) : (
          units.map((unit) => (
            <option key={`${unit.unit_type}-${unit.unit_name}`} value={unit.unit_name}>
              {unit.unit_name} {unit.unit_type === 'secondary' ? '(larger unit)' : '(smallest unit)'}
            </option>
          ))
        )}
      </select>
      {product?.conversion_factor && units.length > 1 && (
        <p className="text-xs text-gray-500">
          Conversion: 1 {product.secondary_unit_of_measure} = {product.conversion_factor} {product.primary_unit_of_measure}
        </p>
      )}
    </div>
  );
};

// Example usage in a transaction form line item
export const TransactionLineItem = ({ 
  index,
  products,
  value,
  onChange,
  onRemove
}: {
  index: number;
  products: Product[];
  value: any;
  onChange: (index: number, field: string, value: any) => void;
  onRemove: (index: number) => void;
}) => {
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const product = products.find(p => p.id === productId);
    
    onChange(index, 'product_id', productId);
    
    if (product) {
      onChange(index, 'description', product.description || '');
      onChange(index, 'unit_price', product.default_unit_price || 0);
      onChange(index, 'tax_percent', product.default_tax_percent || 0);
      // Reset unit of measure when product changes
      onChange(index, 'unit_of_measure', '');
      onChange(index, 'unit_type', '');
    }
  };
  
  const handleUnitChange = (unitName: string, unitType: 'primary' | 'secondary') => {
    onChange(index, 'unit_of_measure', unitName);
    onChange(index, 'unit_type', unitType);
  };
  
  const handleUnitPriceChange = (price: number) => {
    onChange(index, 'unit_price', price);
  };
  
  const calculateAmount = () => {
    const quantity = parseFloat(value.quantity) || 0;
    const unitPrice = parseFloat(value.unit_price) || 0;
    return (quantity * unitPrice).toFixed(2);
  };
  
  return (
    <div className="grid grid-cols-12 gap-2 items-start mb-2 p-2 border border-gray-200 rounded-md">
      <div className="col-span-3">
        <label className="block text-sm font-medium text-gray-700">Product</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value.product_id || ''}
          onChange={handleProductChange}
        >
          <option value="" className="text-blue-600 font-medium">Add New Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="col-span-3">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value.description || ''}
          onChange={(e) => onChange(index, 'description', e.target.value)}
        />
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Qty</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value.quantity || ''}
          onChange={(e) => onChange(index, 'quantity', e.target.value)}
        />
      </div>
      
      <div className="col-span-1">
        <UnitOfMeasureDropdown
          productId={value.product_id || null}
          value={value.unit_of_measure || ''}
          onChange={handleUnitChange}
          onUnitPriceChange={handleUnitPriceChange}
          defaultUnitPrice={products.find(p => p.id === value.product_id)?.default_unit_price}
        />
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value.unit_price || ''}
          onChange={(e) => onChange(index, 'unit_price', e.target.value)}
        />
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Tax %</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value.tax_percent || ''}
          onChange={(e) => onChange(index, 'tax_percent', e.target.value)}
        />
      </div>
      
      <div className="col-span-1">
        <label className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md"
          value={calculateAmount()}
          readOnly
        />
      </div>
      
      <div className="col-span-1 pt-6">
        <button
          type="button"
          className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
