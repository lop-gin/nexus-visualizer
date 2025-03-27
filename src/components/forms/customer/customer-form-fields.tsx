
'use client';

import React, { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { FormTextarea } from '@/components/ui/form-textarea';

interface CustomerFormFieldsProps {
  formState: {
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    billing_address: string;
    shipping_notes: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
}

export const CustomerFormFields = ({
  formState,
  handleInputChange,
  isSubmitting
}: CustomerFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
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
            required
          />
        </div>

        <div className="space-y-2">
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

        <div className="space-y-2">
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

        <div className="space-y-2">
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
      </div>

      <FormTextarea
        label="Address"
        value={formState.address}
        onChange={handleInputChange}
        disabled={isSubmitting}
        rows={3}
        name="address"
      />

      <FormTextarea
        label="Billing Address"
        value={formState.billing_address}
        onChange={handleInputChange}
        disabled={isSubmitting}
        rows={3}
        name="billing_address"
      />
    </div>
  );
};
