'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useCustomerService from '@/lib/sales/customer-service';
import { Customer } from '@/types/sales';
import toast from 'react-hot-toast';

// Schema for customer form
const customerFormSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  company: z.string().optional(),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  billing_address: z.string().optional(),
  initial_balance: z.number().min(0, 'Initial balance must be a positive number').default(0),
});

type CustomerFormData = z.infer<typeof customerFormSchema>;

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerAdded
}) => {
  const { createCustomer } = useCustomerService();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const { 
    control, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      billing_address: '',
      initial_balance: 0,
    }
  });
  
  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);
  
  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      const newCustomer = await createCustomer({
        name: data.name,
        company: data.company || null,
        email: data.email || null,
        billing_address: data.billing_address || null,
        initial_balance: data.initial_balance,
        company_id: 0, // This will be set by the backend based on the current user's company
      });
      
      if (newCustomer) {
        onCustomerAdded(newCustomer);
        onClose();
      }
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Customer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                label="Customer Name"
                error={errors.name?.message}
                required
                {...field}
              />
            )}
          />
          
          <Controller
            name="company"
            control={control}
            render={({ field }) => (
              <Input
                label="Company Name"
                error={errors.company?.message}
                {...field}
              />
            )}
          />
          
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                type="email"
                label="Email"
                error={errors.email?.message}
                {...field}
              />
            )}
          />
          
          <Controller
            name="billing_address"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Billing Address
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  {...field}
                />
                {errors.billing_address && (
                  <p className="text-xs text-red-500">{errors.billing_address.message}</p>
                )}
              </div>
            )}
          />
          
          <Controller
            name="initial_balance"
            control={control}
            render={({ field: { onChange, value, ...rest } }) => (
              <Input
                type="number"
                label="Initial Balance"
                error={errors.initial_balance?.message}
                value={value.toString()}
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                {...rest}
              />
            )}
          />
          
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
              Create Customer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
