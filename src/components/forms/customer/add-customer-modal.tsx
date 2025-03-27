
import React, { useState } from 'react';
import { Customer } from '@/types/sales';
import { Button } from '@/components/ui/button';
import { createCustomer } from '@/lib/sales/customer-service';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import toast from 'react-hot-toast';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerAdded: (customer: Customer) => void;
}

export default function AddCustomerModal({ isOpen, onClose, onCustomerAdded }: AddCustomerModalProps) {
  const [formData, setFormData] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    billing_address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Customer name is required';
    }
    
    // Email validation (optional field)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create customer
      const newCustomer = await createCustomer({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        company: formData.company || null,
        billing_address: formData.billing_address || null,
      });
      
      toast.success('Customer added successfully');
      onCustomerAdded(newCustomer);
      onClose();
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast.error(error.message || 'Failed to add customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input
            id="name"
            name="name"
            label="Customer Name"
            placeholder="Enter customer name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />
          
          <Input
            id="email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="customer@example.com"
            value={formData.email || ''}
            onChange={handleChange}
            error={errors.email}
          />
          
          <Input
            id="phone"
            name="phone"
            label="Phone Number"
            placeholder="Phone number"
            value={formData.phone || ''}
            onChange={handleChange}
          />
          
          <Input
            id="company"
            name="company"
            label="Company Name (Optional)"
            placeholder="Company name"
            value={formData.company || ''}
            onChange={handleChange}
          />
          
          <Textarea
            id="address"
            name="address"
            label="Address"
            placeholder="Enter address"
            value={formData.address || ''}
            onChange={handleChange}
          />
          
          <Textarea
            id="billing_address"
            name="billing_address"
            label="Billing Address (if different)"
            placeholder="Enter billing address"
            value={formData.billing_address || ''}
            onChange={handleChange}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Customer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
