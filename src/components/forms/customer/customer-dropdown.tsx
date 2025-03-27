'use client';

import React from 'react';
import { Customer } from '@/types/sales';
import useCustomerService from '@/lib/sales/customer-service';
import AddCustomerModal from '@/components/forms/customer/add-customer-modal';

interface CustomerDropdownProps {
  value: string;
  onChange: (customerId: string, customerData?: Customer) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const CustomerDropdown: React.FC<CustomerDropdownProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select a customer',
  required = false,
  disabled = false,
}) => {
  const { getCustomers } = useCustomerService();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  // Fetch customers on component mount
  React.useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCustomers();
  }, [getCustomers]);
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    
    if (selectedId === 'add_new') {
      setIsModalOpen(true);
      return;
    }
    
    const selectedCustomer = customers.find(c => c.id === selectedId);
    onChange(selectedId, selectedCustomer);
  };
  
  const handleCustomerAdded = (newCustomer: Customer) => {
    setCustomers(prev => [...prev, newCustomer]);
    onChange(newCustomer.id, newCustomer);
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
          {isLoading ? 'Loading customers...' : placeholder}
        </option>
        
        {/* Add New option in blue */}
        <option value="add_new" className="text-blue-600 font-medium">
          Add New Customer
        </option>
        
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} {customer.company ? `(${customer.company})` : ''}
          </option>
        ))}
      </select>
      
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </>
  );
};

export default CustomerDropdown;
