
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | string | ((row: T) => React.ReactNode);
    className?: string;
  }[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  
  const renderCell = (row: T, accessor: typeof columns[number]['accessor']) => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    
    // Handle string path accessors (e.g., 'user.name')
    if (typeof accessor === 'string' && accessor.includes('.')) {
      const keys = accessor.split('.');
      let value: any = row;
      for (const key of keys) {
        value = value?.[key];
      }
      return value;
    }
    
    // Simple accessor
    return row[accessor as keyof T];
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }
  
  if (!data.length) {
    return (
      <div className="text-center p-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, i) => (
              <TableHead
                key={i}
                className={column.className}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow
              key={i}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
            >
              {columns.map((column, j) => (
                <TableCell key={j} className={column.className}>
                  {renderCell(row, column.accessor)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
