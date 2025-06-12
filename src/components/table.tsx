"use client";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { isValidDateString } from "@/utility/dates";
import { getNestedValue } from "@/utility/objects";
import Image from "next/image";
import { useEffect, useState, ReactNode } from "react";

type TableHeader = {
  key: string;
  label: string;
  className?: string;
};

type ActionProps<T> = {
  row: T;
};

type CustomTableProps<T> = {
  headers: TableHeader[];
  data: T[];
  isLoading: boolean;
  actions?: (props: ActionProps<T>) => ReactNode;
};

export function CustomTable<T extends Record<string, any>>({ headers, data, isLoading, actions }: CustomTableProps<T>) {
  const [loading, setLoading] = useState(isLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <Table className="w-full">
        <TableHeader className="bg-gray-50">
          <TableRow className="hover:bg-gray-50">
            {headers.map((header, index) => (
              <TableHead key={index} className={`text-xs font-medium text-gray-500 uppercase tracking-wider ${header.className}`}>
                {header.label}
              </TableHead>
            ))}
            {actions && <TableHead className="w-[150px] text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-200">
          {loading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {headers.map((_, index) => (
                  <TableCell key={index} className="animate-pulse bg-gray-100 h-12 rounded-none">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="animate-pulse bg-gray-100 h-12 rounded-none">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-gray-50">
              <TableCell colSpan={headers.length + (actions ? 1 : 0)} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">No data available</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-gray-50">
                {headers.map((header, colIndex) => {
                  const value = getNestedValue(row, header.key);

                  let displayValue = value;

                  if (typeof value === "boolean") {
                    displayValue = value ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">No</span>
                    );
                  } else if (/^\/images/.test(value)) {
                    displayValue = <Image src={value} alt="Image" className="object-cover rounded-md" width={100} height={100} />;
                  } else if (typeof value === "string" && isValidDateString(value)) {
                    displayValue = new Date(value).toLocaleString("ID");
                  } else if (typeof value === "number" || !isNaN(parseInt(value))) {
                    displayValue = new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(Number(value));
                  }

                  return (
                    <TableCell key={colIndex} className="max-w-60 lg:max-w-40 text-nowrap text-ellipsis overflow-hidden py-3 text-sm text-gray-700">
                      {displayValue}
                    </TableCell>
                  );
                })}
                {actions && (
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">{actions({ row })}</div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
