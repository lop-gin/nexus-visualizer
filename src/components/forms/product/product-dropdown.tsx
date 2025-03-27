'use client';

import React from 'react';
import { Product } from '@/types/inventory';
import useProductService from '@/lib/inventory/product-service';
import AddProductModal from '@/components/forms/product/add-product-modal';

interface ProductDropdownProps {
  value: string;
  onChange: (productId: string, productData?: Product) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const ProductDropdown: React.FC<ProductDropdownProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select a product',
  required = false,
  disabled = false,
}) => {
  const { getProducts } = useProductService();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Fetch products on component mount
  React.useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [getProducts]);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    
    if (selectedId === 'add_new') {
      setIsModalOpen(true);
      return;
    }
    
    const selectedProduct = products.find(p => p.id === selectedId);
    onChange(selectedId, selectedProduct);
  };
  
  const handleProductAdded = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    onChange(newProduct.id, newProduct);
  };
  
  return (
    <>
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        value={value}
        onChange={handleChange}
        disabled={disabled || isLoading}
        required={required}
      >
        <option value="" disabled>
          {isLoading ? 'Loading products...' : placeholder}
        </option>
        
        {/* Add New option in blue */}
        <option value="add_new" className="text-blue-600 font-medium">
          Add New Product
        </option>
        
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} {product.category ? `(${product.category.name})` : ''}
          </option>
        ))}
      </select>
      
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </>
  );
};

export default ProductDropdown;
