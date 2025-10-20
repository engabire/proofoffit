import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortBy?: keyof T;
  sortDirection?: "asc" | "desc";
  onSort?: (key: keyof T) => void;
  className?: string;
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  sortBy,
  sortDirection = "asc",
  onSort,
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:bg-gray-100",
                    column.className,
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        {sortBy === column.key
                          ? (
                            sortDirection === "asc"
                              ? (
                                <ChevronUp className="h-3 w-3 text-proof-blue" />
                              )
                              : (
                                <ChevronDown className="h-3 w-3 text-proof-blue" />
                              )
                          )
                          : (
                            <div className="flex flex-col">
                              <ChevronUp className="h-2 w-2 text-gray-300" />
                              <ChevronDown className="h-2 w-2 text-gray-300" />
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr
                key={index}
                className={cn(
                  "hover:bg-gray-50 transition-colors",
                  onRowClick && "cursor-pointer",
                  rowClassName?.(row, index),
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                      column.className,
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
