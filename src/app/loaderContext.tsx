"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface LoadingContextProps {
  isLoading: boolean;
  showLoading: (action?: () => Promise<void>) => Promise<void>;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = async (action?: () => Promise<void>) => {
    setIsLoading(true);
    if (action) {
      try {
        await action();
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading }}>
      {children}

      {isLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] pointer-events-auto">
          <Loader2 className="animate-spin text-white w-12 h-12" />
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within a LoadingProvider");
  return context;
};
