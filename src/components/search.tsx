"use client";

import { Input } from "@/components/ui/input";
import { Loader2, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  delay?: number;
  onSearch: (query: string) => void;
  className?: string;
  defaultValue?: string;
  onDebouncedChange?: (query: string) => void;
}

export function SearchInput({ placeholder = "Search...", delay = 300, onSearch, onDebouncedChange, className = "", defaultValue = "" }: SearchInputProps) {
  const [query, setQuery] = useState(defaultValue);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultValue);
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Debounce effect
  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsLocalLoading(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsLocalLoading(false);
    };
  }, [query, delay]);

  // Trigger callbacks
  useEffect(() => {
    onSearch?.(query);
  }, [query, onSearch]);

  useEffect(() => {
    onDebouncedChange?.(debouncedQuery);
  }, [debouncedQuery, onDebouncedChange]);

  const showLoading = isLocalLoading;

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="h-4 w-4 text-gray-400" />
      </div>
      <Input type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 w-full" />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
        {query && !showLoading && (
          <button onClick={() => setQuery("")} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {showLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
      </div>
    </div>
  );
}
