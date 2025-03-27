
import React from 'react';
import { Textarea, TextareaProps } from '@/components/ui/textarea';

interface FormTextareaProps extends TextareaProps {
  label: string;
  name: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, name, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <Textarea
          id={name}
          name={name}
          ref={ref}
          className={className}
          {...props}
        />
      </div>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';
