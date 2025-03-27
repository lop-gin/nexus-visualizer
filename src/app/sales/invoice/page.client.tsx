'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DashboardLayout } from '@/components/common/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomerFormFields from '@/components/forms/customer/customer-form-fields';
import { Customer } from '@/types/sales';
import { SalesRep } from '@/types/sales';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { TransactionLineItem } from '@/components/forms/transaction/unit-dropdown';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Schema for invoice form
const invoiceFormSchema = z.object({
  customer_id: z.string().min(1, 'Customer is required'),
  sales_rep_id: z.string().optional(),
  transaction_date: z.string().min(1, 'Transaction date is required'),
  due_date: z.string().optional(),
  terms: z.string().optional(),
  message: z.string().optional(),
  items: z.array(
    z.object({
      product_id: z.string().optional(),
      description: z.string().optional(),
      quantity: z.number().min(0, 'Quantity must be positive'),
      unit_of_measure: z.string().min(1, 'Unit of measure is required'),
      unit_type: z.enum(['primary', 'secondary']).optional(),
      unit_price: z.number().min(0, 'Price must be positive'),
      tax_percent: z.number().min(0, 'Tax must be positive'),
    })
  ).min(1, 'At least one item is required'),
});

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function InvoicePage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [salesReps, setSalesReps] = React.useState<SalesRep[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [customerEmail, setCustomerEmail] = React.useState('');
  const [customerCompany, setCustomerCompany] = React.useState('');
  const [customerBillingAddress, setCustomerBillingAddress] = React.useState('');
  const supabase = createClientComponentClient<Database>();
  
  const { 
    control, 
    handleSubmit, 
    setValue,
    watch,
    formState: { errors }
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      customer_id: '',
      sales_rep_id: '',
      transaction_date: new Date().toISOString().split('T')[0],
      due_date: '',
      terms: '',
      message: '',
      items: [
        {
          product_id: '',
          description: '',
          quantity: 1,
          unit_of_measure: '',
          unit_type: 'primary',
          unit_price: 0,
          tax_percent: 0,
        }
      ],
    }
  });
  
  const items = watch('items');
  
  // Fetch sales reps and products on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch sales reps (only those with sales rep or sales supervisor roles)
        const { data: employees, error: employeesError } = await supabase
          .from('employees')
          .select(`
            id,
            full_name,
            email,
            role:role_id(id, name)
          `)
          .or('role.name.eq.Sales Rep,role.name.eq.Sales Supervisor');
        
        if (employeesError) {
          throw employeesError;
        }
        
        // Transform employees to sales reps format
        const salesRepsData = employees.map(emp => ({
          id: emp.id,
          name: emp.full_name,
          email: emp.email,
        }));
        
        setSalesReps(salesRepsData);
        
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('name');
        
        if (productsError) {
          throw productsError;
        }
        
        setProducts(productsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [supabase]);
  
  const handleCustomerChange = (customerId: string, customerData?: Customer) => {
    setValue('customer_id', customerId);
    
    if (customerData) {
      setCustomerEmail(customerData.email || '');
      setCustomerCompany(customerData.company || '');
      setCustomerBillingAddress(customerData.billing_address || '');
    }
  };
  
  const handleAddItem = () => {
    const currentItems = watch('items');
    setValue('items', [
      ...currentItems,
      {
        product_id: '',
        description: '',
        quantity: 1,
        unit_of_measure: '',
        unit_type: 'primary',
        unit_price: 0,
        tax_percent: 0,
      }
    ]);
  };
  
  const handleRemoveItem = (index: number) => {
    const currentItems = watch('items');
    setValue('items', currentItems.filter((_, i) => i !== index));
  };
  
  const handleItemChange = (index: number, field: string, value: any) => {
    const currentItems = [...watch('items')];
    currentItems[index] = {
      ...currentItems[index],
      [field]: value
    };
    setValue('items', currentItems);
  };
  
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity.toString()) || 0;
      const unitPrice = parseFloat(item.unit_price.toString()) || 0;
      return sum + (quantity * unitPrice);
    }, 0).toFixed(2);
  };
  
  const calculateTaxTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity.toString()) || 0;
      const unitPrice = parseFloat(item.unit_price.toString()) || 0;
      const taxPercent = parseFloat(item.tax_percent.toString()) || 0;
      return sum + (quantity * unitPrice * taxPercent / 100);
    }, 0).toFixed(2);
  };
  
  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const taxTotal = parseFloat(calculateTaxTotal());
    return (subtotal + taxTotal).toFixed(2);
  };
  
  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would save the invoice to Supabase
      console.log('Invoice data:', data);
      
      // Calculate totals
      const netTotal = parseFloat(calculateSubtotal());
      const taxTotal = parseFloat(calculateTaxTotal());
      const grossTotal = parseFloat(calculateTotal());
      
      // Create transaction in Supabase
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([
          {
            transaction_number: `INV-${Date.now()}`, // Generate a unique invoice number
            transaction_type: 'invoice',
            customer_id: data.customer_id,
            sales_rep_id: data.sales_rep_id || null,
            transaction_date: data.transaction_date,
            due_date: data.due_date || null,
            terms: data.terms || null,
            message: data.message || null,
            net_total: netTotal,
            tax_total: taxTotal,
            other_fees: 0,
            gross_total: grossTotal,
            status: 'due',
          }
        ])
        .select()
        .single();
      
      if (transactionError) {
        throw transactionError;
      }
      
      // Create transaction items
      const transactionItems = data.items.map(item => ({
        transaction_id: transaction.id,
        product_id: item.product_id || null,
        description: item.description || null,
        quantity: item.quantity,
        unit_of_measure: item.unit_of_measure,
        unit_type: item.unit_type || 'primary',
        unit_price: item.unit_price,
        tax_percent: item.tax_percent,
        amount: item.quantity * item.unit_price,
      }));
      
      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(transactionItems);
      
      if (itemsError) {
        throw itemsError;
      }
      
      toast.success('Invoice created successfully');
      
      // Reset form or redirect
      // window.location.href = `/dashboard/sales/invoices/${transaction.id}`;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Failed to create invoice');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Create Invoice</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerFormFields
                customerId={watch('customer_id')}
                onCustomerChange={handleCustomerChange}
                email={customerEmail}
                onEmailChange={setCustomerEmail}
                company={customerCompany}
                onCompanyChange={setCustomerCompany}
                billingAddress={customerBillingAddress}
                onBillingAddressChange={setCustomerBillingAddress}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="transaction_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      label="Invoice Date"
                      error={errors.transaction_date?.message}
                      required
                      {...field}
                    />
                  )}
                />
                
                <Controller
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="date"
                      label="Due Date"
                      error={errors.due_date?.message}
                      {...field}
                    />
                  )}
                />
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Sales Representative
                  </label>
                  <Controller
                    name="sales_rep_id"
                    control={control}
                    render={({ field }) => (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        {...field}
                      >
                        <option value="">Select Sales Rep</option>
                        {salesReps.map((rep) => (
                          <option key={rep.id} value={rep.id}>
                            {rep.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.sales_rep_id && (
                    <p className="text-xs text-red-500">{errors.sales_rep_id.message}</p>
                  )}
                </div>
                
                <Controller
                  name="terms"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Terms"
                      error={errors.terms?.message}
                      placeholder="e.g., Net 30"
                      {...field}
                    />
                  )}
                />
              </div>
              
              <div className="mt-4">
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Message on Invoice
                      </label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Thank you for your business!"
                        {...field}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500">{errors.message.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button
                type="button"
                onClick={handleAddItem}
                leftIcon={<PlusCircle className="h-4 w-4 mr-2" />}
              >
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <TransactionLineItem
                    key={index}
                    index={index}
                    products={products}
                    value={item}
                    onChange={handleItemChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
                
                {errors.items && (
                  <p className="text-xs text-red-500">{errors.items.message}</p>
                )}
                
                <div className="flex flex-col items-end space-y-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between w-full md:w-1/3">
                    <span className="font-medium">Subtotal:</span>
                    <span>${calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between w-full md:w-1/3">
                    <span className="font-medium">Tax:</span>
                    <span>${calculateTaxTotal()}</span>
                  </div>
                  <div className="flex justify-between w-full md:w-1/3 text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating Invoice..."
            >
              Create Invoice
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
