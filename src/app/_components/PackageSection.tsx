"use client";

import { Package } from "@/generated/prisma";
import { FetchData } from "@/lib/fetch";
import { formatNumber } from "@/utility/number";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PackageSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const { data } = (await FetchData(`/api/package`, "GET", null)) as { data: { packages: Package[] } };

        // Format the price from bigint to currency string
        const formattedPackages = data.packages.map((pkg) => ({
          ...pkg,
          price: formatNumber(pkg.price),
        })) as any[];

        setPackages(formattedPackages);
      } catch (error) {
        console.error("Failed to fetch packages:", error instanceof Error ? error.message : error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (isLoading) {
    return (
      <section id="packages" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Our Wedding Packages</h3>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Choose the package that fits your dream wedding</p>

          <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-8 min-w-max">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className={`w-80 flex-shrink-0 p-6 rounded-lg shadow-sm border-t-4 ${index === 1 ? "border-pink-500 transform md:-translate-y-4 bg-gray-50" : "border-pink-300"}`}>
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-10 bg-gray-200 rounded mt-6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">Our Wedding Packages</h3>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">Choose the package that fits your dream wedding</p>

        {packages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No packages available at the moment.</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-8 min-w-max">
              {packages.map((pkg, index) => (
                <div key={index} className={`w-80 flex-shrink-0 p-6 rounded-lg shadow-sm border-t-4 border-pink-300`}>
                  {pkg.image && (
                    <div className="mb-4 h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/default-wedding.jpg";
                        }}
                      />
                    </div>
                  )}
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">{pkg.name}</h4>
                  <p className="text-3xl font-bold text-pink-500 mb-3">{pkg.price}</p>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <Link href={`/booking/${pkg.id}`} className="w-full block text-center px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors">
                    Book Package
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
