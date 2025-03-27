
'use client';

import React, { useState, useCallback, ChangeEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormTextarea } from '@/components/ui/form-textarea';
import toast from 'react-hot-toast';
import { createCustomer } from '@/lib/sales/customer-service';
import { Customer } from '@/types/sales';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: Customer) => void;
}

export const AddCustomerModal = ({ isOpen, onClose, onCustomerAdded }: AddCustomerModalProps) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    billing_address: '',
    shipping_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!formState.name) {
      toast.error('Customer name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCustomer({
        name: formState.name,
        email: formState.email || null,
        phone: formState.phone || null,
        address: formState.address || null,
        company: formState.company || null,
        billing_address: formState.billing_address || null,
        shipping_notes: formState.shipping_notes || null
      });

      if (result.success && result.customer) {
        toast.success('Customer added successfully');
        onCustomerAdded(result.customer);
        onClose();
        setFormState({
          name: '',
          email: '',
          phone: '',
          address: '',
          company: '',
          billing_address: '',
          shipping_notes: ''
        });
      } else {
        toast.error(result.error || 'Failed to add customer');
      }
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast.error('Error adding customer: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              name="name"
              value={formState.name}
              onChange={handleInputChange}
              placeholder="Enter customer name"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formState.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
            <Input
              id="phone"
              name="phone"
              value={formState.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="company" className="text-sm font-medium text-gray-700">Company</label>
            <Input
              id="company"
              name="company"
              value={formState.company}
              onChange={handleInputChange}
              placeholder="Enter company name"
              disabled={isSubmitting}
            />
          </div>

          <FormTextarea
            name="address"
            label="Address"
            value={formState.address}
            onChange={handleInputChange}
            rows={3}
          />

          <FormTextarea
            name="billing_address"
            label="Billing Address"
            value={formState.billing_address}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Customer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
