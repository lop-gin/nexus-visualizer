
import { useState, useEffect } from 'react';
import { fetchCustomers } from '@/lib/sales/customer-service';
import { Customer } from '@/types/sales';

export interface CustomerDropdownProps {
  value: string;
  onChange: (id: string, customerData?: Customer) => void;
  disabled?: boolean;
  className?: string;
}

export default function CustomerDropdown({ 
  value, 
  onChange, 
  disabled = false,
  className = ''
}: CustomerDropdownProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        const data = await fetchCustomers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        console.error('Error loading customers:', err);
        setError('Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCustomers();
  }, []);
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedCustomer = customers.find(c => c.id === selectedId);
    onChange(selectedId || '', selectedCustomer);
  };
  
  return (
    <div className={className}>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={handleSelectChange}
        disabled={disabled || isLoading}
      >
        <option value="">Select a customer</option>
        <option value="new" className="text-blue-600 font-medium">+ Add New Customer</option>
        
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>
            {customer.name} {customer.company && `(${customer.company})`}
          </option>
        ))}
      </select>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {isLoading && <p className="mt-1 text-sm text-gray-500">Loading customers...</p>}
    </div>
  );
}
