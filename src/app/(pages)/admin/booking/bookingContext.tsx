"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface BookingContextProps {
  shouldRefresh: boolean;
  setShouldRefresh: (val: boolean) => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBookingContext must be used within a BookingProvider");
  return context;
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  return <BookingContext.Provider value={{ shouldRefresh, setShouldRefresh }}>{children}</BookingContext.Provider>;
}
