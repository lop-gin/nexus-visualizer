'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useProductService from '@/lib/inventory/product-service';
import { Product, Category } from '@/types/inventory';
import toast from 'react-hot-toast';

// Schema for product form
const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  category_id: z.string().optional(),
  default_unit_price: z.number().min(0, 'Unit price must be a positive number').default(0),
  primary_unit_of_measure: z.string().min(1, 'Primary unit of measure is required'),
  secondary_unit_of_measure: z.string().optional(),
  conversion_factor: z.number().min(0, 'Conversion factor must be a positive number').optional(),
  default_tax_percent: z.number().min(0, 'Tax percentage must be a positive number').default(0),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded
}) => {
  const { createProduct, getCategories, createCategory } = useProductService();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(true);
  const [showNewCategory, setShowNewCategory] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryDescription, setNewCategoryDescription] = React.useState('');
  
  const { 
    control, 
    handleSubmit, 
    reset,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      default_unit_price: 0,
      primary_unit_of_measure: '',
      secondary_unit_of_measure: '',
      conversion_factor: undefined,
      default_tax_percent: 0,
    }
  });
  
  // Watch for secondary unit and conversion factor to validate
  const secondaryUnit = watch('secondary_unit_of_measure');
  const conversionFactor = watch('conversion_factor');
  
  // Fetch categories on component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      if (isOpen) {
        setIsLoadingCategories(true);
        try {
          const data = await getCategories();
          setCategories(data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setIsLoadingCategories(false);
        }
      }
    };
    
    fetchCategories();
  }, [isOpen, getCategories]);
  
  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      reset();
      setShowNewCategory(false);
      setNewCategoryName('');
      setNewCategoryDescription('');
    }
  }, [isOpen, reset]);
  
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    try {
      const newCategory = await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
        company_id: 0, // This will be set by the backend based on the current user's company
      });
      
      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
        setShowNewCategory(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
  
  const onSubmit = async (data: ProductFormData) => {
    // Validate that if secondary unit is provided, conversion factor is also provided
    if (data.secondary_unit_of_measure && !data.conversion_factor) {
      toast.error('Conversion factor is required when secondary unit is provided');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newProduct = await createProduct({
        name: data.name,
        description: data.description || null,
        category_id: data.category_id ? parseInt(data.category_id) : null,
        default_unit_price: data.default_unit_price,
        primary_unit_of_measure: data.primary_unit_of_measure,
        secondary_unit_of_measure: data.secondary_unit_of_measure || null,
        conversion_factor: data.conversion_factor || null,
        default_tax_percent: data.default_tax_percent,
        company_id: 0, // This will be set by the backend based on the current user's company
      });
      
      if (newProduct) {
        onProductAdded(newProduct);
        onClose();
      }
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                label="Product Name"
                error={errors.name?.message}
                required
                {...field}
              />
            )}
          />
          
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  {...field}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>
            )}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            {showNewCategory ? (
              <div className="space-y-3">
                <Input
                  placeholder="New Category Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Category Description (optional)"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    size="sm"
                  >
                    Save Category
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewCategory(false)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Controller
                  name="category_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoadingCategories}
                      {...field}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <Button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  size="sm"
                >
                  Add New
                </Button>
              </div>
            )}
            {errors.category_id && (
              <p className="text-xs text-red-500">{errors.category_id.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="default_unit_price"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Input
                  type="number"
                  label="Default Unit Price"
                  error={errors.default_unit_price?.message}
                  value={value.toString()}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  {...rest}
                />
              )}
            />
            
            <Controller
              name="default_tax_percent"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Input
                  type="number"
                  label="Default Tax Percentage"
                  error={errors.default_tax_percent?.message}
                  value={value.toString()}
                  onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                  {...rest}
                />
              )}
            />
          </div>
          
          <div className="border p-4 rounded-md bg-gray-50">
            <h3 className="font-medium mb-3">Units of Measure</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="primary_unit_of_measure"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Primary Unit of Measure (Smallest Unit)"
                    placeholder="e.g., piece, gram, ml"
                    error={errors.primary_unit_of_measure?.message}
                    required
                    {...field}
                  />
                )}
              />
              
              <Controller
                name="secondary_unit_of_measure"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Secondary Unit of Measure (Larger Unit)"
                    placeholder="e.g., dozen, kg, liter"
                    error={errors.secondary_unit_of_measure?.message}
                    {...field}
                  />
                )}
              />
            </div>
            
            <div className="mt-3">
              <Controller
                name="conversion_factor"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Input
                    type="number"
                    label="Conversion Factor"
                    placeholder="How many primary units make one secondary unit"
                    error={errors.conversion_factor?.message}
                    value={value?.toString() || ''}
                    onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    disabled={!secondaryUnit}
                    {...rest}
                  />
                )}
              />
              
              {secondaryUnit && conversionFactor && (
                <p className="text-sm text-gray-600 mt-2">
                  1 {secondaryUnit} = {conversionFactor} {watch('primary_unit_of_measure')}
                </p>
              )}
              
              {secondaryUnit && !conversionFactor && (
                <p className="text-sm text-red-500 mt-2">
                  Please specify how many {watch('primary_unit_of_measure')} make up one {secondaryUnit}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Create Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
