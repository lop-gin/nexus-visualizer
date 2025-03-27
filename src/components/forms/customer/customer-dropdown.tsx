
import React, { useState, useEffect } from 'react';
import { Customer } from '@/types/sales';
import { fetchCustomers } from '@/lib/sales/customer-service';
import { isValidId } from '@/lib/utils';

interface CustomerDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  onAddNewClick?: () => void;
}

export default function CustomerDropdown({ 
  value, 
  onChange, 
  label = 'Customer', 
  error,
  onAddNewClick 
}: CustomerDropdownProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Fetch customers on component mount
  useEffect(() => {
    const getCustomers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCustomers();
        setCustomers(data);
        
        // If we have a value, find the customer
        if (value && data.length > 0) {
          const customer = data.find(c => c.id === value);
          if (customer) {
            setSelectedCustomer(customer);
          }
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getCustomers();
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (isValidId(selectedId)) {
      onChange(selectedId);
      const customer = customers.find(c => c.id === selectedId);
      setSelectedCustomer(customer || null);
    } else {
      onChange('');
      setSelectedCustomer(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {onAddNewClick && (
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={onAddNewClick}
          >
            + Add New
          </button>
        )}
      </div>
      <select
        id="customer"
        value={value || ''}
        onChange={handleChange}
        className={`block w-full px-3 py-2 bg-white border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        disabled={isLoading}
      >
        <option value="">Select a customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id || ''}>
            {customer.name} {customer.company ? `(${customer.company})` : ''}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      
      {selectedCustomer && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
          <div><strong>Address:</strong> {selectedCustomer.address || 'Not provided'}</div>
          <div><strong>Billing:</strong> {selectedCustomer.billing_address || 'Same as address'}</div>
          <div><strong>Email:</strong> {selectedCustomer.email || 'Not provided'}</div>
          <div><strong>Phone:</strong> {selectedCustomer.phone || 'Not provided'}</div>
        </div>
      )}
    </div>
  );
}
