
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

export type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyStateMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  loading = false,
  onRowClick,
  emptyStateMessage = "No data available"
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <p>{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, idx) => (
              <TableHead key={idx} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIdx) => (
            <TableRow 
              key={rowIdx}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={onRowClick ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800" : ""}
            >
              {columns.map((col, colIdx) => (
                <TableCell key={colIdx} className={col.className}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(row)
                    : row[col.accessor] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
