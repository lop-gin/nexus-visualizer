'use client';

import React from 'react';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/inventory';
import useProductService from '@/lib/inventory/product-service';
import AddProductModal from '@/components/forms/product/add-product-modal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const { getProducts, deleteProduct } = useProductService();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  
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
  
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const success = await deleteProduct(id);
        if (success) {
          setProducts(products.filter(product => product.id !== id));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };
  
  const handleProductAdded = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    toast.success('Product added successfully');
  };
  
  const handleProductUpdated = (updatedProduct: Product) => {
    setProducts(prev => prev.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    toast.success('Product updated successfully');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
          <Button
            onClick={handleAddProduct}
            leftIcon={<PlusCircle className="h-4 w-4 mr-2" />}
          >
            Add Product
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Product List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No products found</p>
                <Button
                  onClick={handleAddProduct}
                  variant="outline"
                  className="mt-2"
                >
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Category</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Primary Unit</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Secondary Unit</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Conversion</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Default Price</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{product.name}</td>
                        <td className="px-4 py-3">{product.category?.name || '-'}</td>
                        <td className="px-4 py-3">{product.primary_unit_of_measure}</td>
                        <td className="px-4 py-3">{product.secondary_unit_of_measure || '-'}</td>
                        <td className="px-4 py-3">
                          {product.secondary_unit_of_measure && product.conversion_factor
                            ? `1 ${product.secondary_unit_of_measure} = ${product.conversion_factor} ${product.primary_unit_of_measure}`
                            : '-'}
                        </td>
                        <td className="px-4 py-3">${product.default_unit_price?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </DashboardLayout>
  );
}
