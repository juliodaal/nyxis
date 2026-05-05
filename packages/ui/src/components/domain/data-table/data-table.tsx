'use client';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../../lib/utils.js';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  /** Add a global search input above the table. */
  searchable?: boolean;
  /** Search placeholder text. */
  searchPlaceholder?: string;
  /** Page size when pagination is enabled. */
  pageSize?: number;
  /** Disable pagination. */
  paginate?: boolean;
  className?: string;
}

/**
 * Headless-flavored data table with sort, global filter, and pagination.
 * Built on **TanStack Table**. Used in document AI workflows (extraction queue)
 * and **Lead Intelligence** (lead pipeline).
 */
export function DataTable<TData>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 10,
  paginate = true,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(paginate
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          initialState: { pagination: { pageSize } },
        }
      : {}),
  });

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {searchable ? (
        <div>
          <input
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-9 w-full max-w-xs rounded-md border px-3 text-sm focus-visible:outline-none focus-visible:ring-2"
          />
        </div>
      ) : null}

      <div className="border-border overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => {
                  const sortDir = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className="text-muted-foreground px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="hover:text-foreground inline-flex items-center gap-1"
                          disabled={!header.column.getCanSort()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDir === 'asc' ? (
                            <ChevronUp className="size-3" />
                          ) : sortDir === 'desc' ? (
                            <ChevronDown className="size-3" />
                          ) : null}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-muted-foreground px-3 py-8 text-center text-sm"
                >
                  No results.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-border border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="text-foreground px-3 py-2 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {paginate ? (
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="border-border grid size-8 place-items-center rounded-md border disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="border-border grid size-8 place-items-center rounded-md border disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
