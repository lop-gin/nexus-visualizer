
import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available.',
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="w-full flex justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="text-center py-4 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, i) => (
            <TableHead key={i} className={column.className}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow 
            key={rowIndex}
            onClick={() => onRowClick && onRowClick(row)}
            className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
          >
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex} className={column.className}>
                {typeof column.accessor === 'function'
                  ? column.accessor(row)
                  : row[column.accessor] as React.ReactNode}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
