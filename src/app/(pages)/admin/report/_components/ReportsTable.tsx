"use client";

import { CustomPagination } from "@/components/pagination";
import { CustomTable } from "@/components/table";
import { useCallback, useContext, useEffect, useState } from "react";
import { FetchData } from "@/lib/fetch";
import { Feedback } from "@/app/_lib/type";
import { useAuth } from "@/app/authContext";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/loaderContext";
import { SearchInput } from "@/components/search";
import Link from "next/link";
import { Package, Booking } from "@/generated/prisma";

type PackageReports = {
  count: number;
  totalPayments: string | number;
  price: string;
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export default function BookingTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(99);
  const [bookings, setBookings] = useState<PackageReports[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { auth, getAuth } = useAuth();
  const { showLoading } = useLoading();
  const router = useRouter();

  const headers = [
    { label: "Name", key: "name" },
    { label: "Image", key: "image" },
    { label: "Price", key: "price" },
    { label: "Approved Bookings", key: "count", isNotCurrency: true },
    { label: "Total Payments", key: "totalPayments" },
    { label: "Deleted At", key: "deletedAt" },
  ];

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const { data } = (await FetchData(`/api/admin/report`, "GET", null, { page: currentPage })) as { data: { page: number; total_pages: number; packages: PackageReports[] } };
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
        setBookings(data.packages);
      } catch (error) {
        if (typeof error == "string") {
          console.info(error);
        } else if (error instanceof Error) {
          console.info(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);

    // Simulate fetching data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      <CustomTable data={bookings} headers={headers} isLoading={isLoading} />
      <CustomPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
    </div>
  );
}
