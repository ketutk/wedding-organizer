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
import { Package } from "@/generated/prisma";
import { PackageProvider, usePackageContext } from "../packageContext";
import ViewModal from "./ViewModal";
import ReusableModal from "./ReusableModal";
import AddPackageForm from "./AddPackageForm";
import UpdatePackageForm from "./UpdatePackageForm";

export default function PackageTable() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(99);
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { shouldRefresh, setShouldRefresh } = usePackageContext();

  const { auth, getAuth } = useAuth();
  const { showLoading } = useLoading();
  const router = useRouter();

  const headers = [
    { label: "Package", key: "name" },
    { label: "Image", key: "image" },
    { label: "Price", key: "price" },
    { label: "Created At", key: "createdAt" },
  ];

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const { data } = (await FetchData(`/api/admin/package`, "GET", null, { page: currentPage, search: searchTerm })) as { data: { page: number; total_pages: number; packages: Package[] } };
        console.log(data);
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
        setPackages(data.packages);
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

  const renderActions = ({ row }: { row: Package }) => {
    return (
      <div className="flex gap-2">
        <ViewModal data={row} />
        <ReusableModal
          title="Update Package"
          triggerLabel="Update Package"
          triggerLabelClassname="outline outline-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white"
          form={<UpdatePackageForm data={row} />}
          button={
            <button
              className="px-4 py-2 outline outline-pink-400 text-pink-400 font-bold rounded hover:bg-pink-400 hover:text-white cursor-pointer"
              onClick={() => {
                document.getElementById("update_package_button")?.click();
              }}
            >
              Update Package
            </button>
          }
        />
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <SearchInput
          placeholder="Search users..."
          onSearch={handleSearchChange}
          onDebouncedChange={handleDebouncedSearch}
          delay={1000} // Custom debounce delay
          className="mb-4 max-w-md"
        />
        <ReusableModal
          title="Add Package"
          triggerLabel="Add Package"
          form={<AddPackageForm />}
          button={
            <button
              className="px-4 py-2 outline outline-black rounded hover:bg-black hover:text-white cursor-pointer"
              onClick={() => {
                document.getElementById("submit_button")?.click();
              }}
            >
              Submit
            </button>
          }
        />
      </div>
      <CustomTable data={packages} headers={headers} isLoading={isLoading} actions={renderActions} />
      <CustomPagination currentPage={currentPage} onPageChange={handlePageChange} totalPages={totalPages} />
    </div>
  );
}
