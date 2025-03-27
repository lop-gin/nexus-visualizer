
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CustomerDropdown from './customer-dropdown';
import { Customer } from '@/types/sales';

interface CustomerFormFieldsProps {
  customerId: string;
  onCustomerChange: (id: string, customerData?: Customer) => void;
  email: string;
  onEmailChange: (value: string) => void;
  company: string;
  onCompanyChange: (value: string) => void;
  billingAddress: string;
  onBillingAddressChange: (value: string) => void;
  disabled?: boolean;
}

const CustomerFormFields: React.FC<CustomerFormFieldsProps> = ({
  customerId,
  onCustomerChange,
  email,
  onEmailChange,
  company,
  onCompanyChange,
  billingAddress,
  onBillingAddressChange,
  disabled = false
}) => {
  
  const handleCustomerSelected = (id: string, customerData?: Customer) => {
    onCustomerChange(id, customerData);
    
    if (customerData) {
      onEmailChange(customerData.email || '');
      onCompanyChange(customerData.company || '');
      onBillingAddressChange(customerData.billing_address || '');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomerDropdown 
          value={customerId}
          onChange={handleCustomerSelected}
          disabled={disabled}
        />
        
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Company"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          disabled={disabled}
        />
        
        <Textarea
          label="Billing Address"
          value={billingAddress}
          onChange={(e) => onBillingAddressChange(e.target.value)}
          disabled={disabled}
          rows={3}
        />
      </div>
    </div>
  );
};

export default CustomerFormFields;
