"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface PackageContextProps {
  shouldRefresh: boolean;
  setShouldRefresh: (val: boolean) => void;
}

const PackageContext = createContext<PackageContextProps | undefined>(undefined);

export function usePackageContext() {
  const context = useContext(PackageContext);
  if (!context) throw new Error("usePackageContext must be used within a PackageProvider");
  return context;
}

export function PackageProvider({ children }: { children: ReactNode }) {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  return <PackageContext.Provider value={{ shouldRefresh, setShouldRefresh }}>{children}</PackageContext.Provider>;
}
