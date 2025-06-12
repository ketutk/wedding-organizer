"use client";

import { CustomPagination } from "@/components/pagination";
import { CustomTable } from "@/components/table";
import { useCallback, useEffect, useState } from "react";
import { FetchData } from "@/lib/fetch";
import { Feedback } from "@/app/_lib/type";
import { useAuth } from "@/app/authContext";
import { useRouter } from "next/navigation";
import { useLoading } from "@/app/loaderContext";
import { CompanyWithCount } from "../../type";
import { SearchInput } from "@/components/search";
import Link from "next/link";

export default function CompaniesTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(99);
  const [companies, setCompanies] = useState<CompanyWithCount[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { auth, getAuth } = useAuth();
  const { showLoading } = useLoading();
  const router = useRouter();

  const headers = [
    { label: "Company", key: "name" },
    { label: "Joined Date", key: "createdAt" },
    { label: "Feedbacks", key: "_count.feedbacks" },
  ];

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const { data } = (await FetchData(`/api/admin/company`, "GET", null, { page: currentPage, search: searchTerm })) as { data: { page: number; total_pages: number; companies: CompanyWithCount[] } };
        console.log(data);
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
        setCompanies(data.companies);
      } catch (error) {
        if (typeof error == "string") {
          console.error(error);
        } else if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldRefresh) {
      fetch();
      setShouldRefresh(false);
    }
  }, [shouldRefresh]);

  const renderActions = ({ row }: { row: CompanyWithCount }) => {
    return (
      <div className="flex gap-2">
        <Link href={`/admin/company/${row.id}`} className="cursor-pointer py-2 px-4 outline outline-green-600 text-green-600 hover:bg-green-700 hover:text-white rounded-md font-semibold">
          View
        </Link>
      </div>
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsLoading(true);
    setShouldRefresh(true);

    // Simulate fetching data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // This will only be called when the debounced query changes
  const handleDebouncedSearch = useCallback((query: string) => {
    setSearchTerm(query);
    setShouldRefresh(true);
  }, []);

  // Regular search changes (optional)
  const handleSearchChange = (query: string) => {
    setSearchTerm(query);
  };

  return (
    <div className="w-full flex flex-col gap-y-4">
      <SearchInput
        placeholder="Search users..."
        onSearch={handleSearchChange}
        onDebouncedChange={handleDebouncedSearch}
        delay={1000} // Custom debounce delay
        className="mb-4 max-w-md"
      />
      <CustomTable data={companies} headers={headers} isLoading={isLoading} actions={renderActions} />
      <CustomPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
    </div>
  );
}
