"use client";

import BookingTable from "./_components/BookingTable";
import { BookingProvider } from "./bookingContext";

export default function BookingPage() {
  return (
    <div className="p-6">
      <BookingProvider>
        <BookingTable />
      </BookingProvider>
    </div>
  );
}
