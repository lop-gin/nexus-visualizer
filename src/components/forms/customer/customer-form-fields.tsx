'use client';

import React from 'react';
import { Customer } from '@/types/sales';
import CustomerDropdown from '@/components/forms/customer/customer-dropdown';

interface CustomerFormFieldsProps {
  customerId: string;
  onCustomerChange: (customerId: string, customerData?: Customer) => void;
  email: string;
  onEmailChange: (email: string) => void;
  company: string;
  onCompanyChange: (company: string) => void;
  billingAddress: string;
  onBillingAddressChange: (address: string) => void;
  disabled?: boolean;
}

export const CustomerFormFields: React.FC<CustomerFormFieldsProps> = ({
  customerId,
  onCustomerChange,
  email,
  onEmailChange,
  company,
  onCompanyChange,
  billingAddress,
  onBillingAddressChange,
  disabled = false,
}) => {
  // Handle customer selection and auto-populate fields
  const handleCustomerChange = (id: string, customerData?: Customer) => {
    onCustomerChange(id, customerData);
    
    // Auto-populate fields if customer data is available
    if (customerData) {
      if (customerData.email) {
        onEmailChange(customerData.email);
      }
      
      if (customerData.company) {
        onCompanyChange(customerData.company);
      }
      
      if (customerData.billing_address) {
        onBillingAddressChange(customerData.billing_address);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Customer
        </label>
        <CustomerDropdown
          value={customerId}
          onChange={handleCustomerChange}
          required
          disabled={disabled}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Billing Address
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={billingAddress}
          onChange={(e) => onBillingAddressChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default CustomerFormFields;
