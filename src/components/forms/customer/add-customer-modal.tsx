
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Customer } from '@/types/sales';
import { createCustomer } from '@/lib/sales/customer-service';
import toast from 'react-hot-toast';

interface AddCustomerModalProps {
  onCustomerAdded: (customer: Customer) => void;
  trigger?: React.ReactNode;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ 
  onCustomerAdded,
  trigger
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    billing_address: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Customer name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newCustomer = await createCustomer(formData);
      
      if (newCustomer) {
        toast.success('Customer added successfully');
        onCustomerAdded(newCustomer);
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          company: '',
          billing_address: ''
        });
        setOpen(false);
      } else {
        throw new Error('Failed to add customer');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred while adding the customer');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Add New Customer</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          
          <Input
            type="email"
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
          />
          
          <Input
            label="Company"
            name="company"
            value={formData.company || ''}
            onChange={handleChange}
          />
          
          <Textarea
            label="Address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            rows={3}
          />
          
          <Textarea
            label="Billing Address"
            name="billing_address"
            value={formData.billing_address || ''}
            onChange={handleChange}
            rows={3}
          />
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              isLoading={isSubmitting}
              loadingText="Adding..."
            >
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerModal;
