'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/helpers';

interface FormLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function FormLayout({ children, className }: FormLayoutProps) {
  return (
    <div className={cn("bg-gray-50 min-h-screen w-full", className)}>
      <div className="bg-transparent">
        {children}
      </div>
    </div>
  );
}

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function FormHeader({ title, subtitle, className }: FormHeaderProps) {
  return (
    <div className={cn("bg-white border-b border-gray-200 px-4 py-4", className)}>
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ children, className }: FormSectionProps) {
  return (
    <div className={cn("bg-white rounded-md shadow-sm p-4 mb-6", className)}>
      {children}
    </div>
  );
}

interface FormFooterProps {
  onSave: () => void;
  onClear?: () => void;
  onSaveAndNew?: () => void;
  saveLabel?: string;
  clearLabel?: string;
  saveAndNewLabel?: string;
  isSaving?: boolean;
  className?: string;
}

export function FormFooter({ 
  onSave, 
  onClear, 
  onSaveAndNew, 
  saveLabel = "Save",
  clearLabel = "Clear Form",
  saveAndNewLabel = "Save and New",
  isSaving = false,
  className 
}: FormFooterProps) {
  return (
    <div className={cn("bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center sticky bottom-0", className)}>
      <div>
        {onClear && (
          <button 
            type="button" 
            onClick={onClear}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {clearLabel}
          </button>
        )}
      </div>
      <div className="flex space-x-3">
        {onSaveAndNew && (
          <button
            type="button"
            onClick={onSaveAndNew}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            disabled={isSaving}
          >
            {saveAndNewLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            saveLabel
          )}
        </button>
      </div>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FormField({ 
  label, 
  error, 
  required = false, 
  children, 
  className,
  labelClassName
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className={cn("block text-sm font-medium text-gray-700", labelClassName)}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
