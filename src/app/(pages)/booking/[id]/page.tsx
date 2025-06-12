"use client";

import UserLayout from "@/app/_components/userLayout";
import { Package } from "@/generated/prisma";
import { FetchData } from "@/lib/fetch";
import { formatNumber } from "@/utility/number";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BookingForm from "./_components/BookingForm";
import { useMessage } from "@/app/messageContext";

type BookingForm = {
  packageId: string;
  customerName: string;
  customerEmail: string;
  date: string;
};

export default function BookingsDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { showMessage } = useMessage();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [formData, setFormData] = useState<BookingForm>({
    packageId: id as string,
    customerName: "",
    customerEmail: "",
    date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = (await FetchData(`/api/package/${id}`, "GET", null)) as { data: Package };
        setPackageData(response.data);
        console.log(response.data);
      } catch (error) {
        if (typeof error == "string") {
          showMessage(error, "error");
        } else if (error instanceof Error) {
          showMessage(error.message, "error");
        }
        router.push("/");
      }
    };

    fetchPackage();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await FetchData("/api/booking", "POST", formData);
      if (response) {
        alert("Booking created successfully!");
        router.push("/bookings");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Book Your Wedding Package</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Package Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Package Details</h2>

            {packageData ? (
              <>
                {packageData.image && (
                  <div className="mb-6 h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={packageData.image}
                      alt={packageData.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/default-wedding.jpg";
                      }}
                    />
                  </div>
                )}

                <h3 className="text-xl font-bold text-pink-600 mb-2">{packageData.name}</h3>
                <p className="text-3xl font-bold text-gray-800 mb-4">{formatNumber(packageData.price)}</p>
                <p className="text-gray-600 mb-6">{packageData.description}</p>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {packageData.description.split("\n").map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="animate-pulse space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            )}
          </div>

          {/* Booking Form Section */}
          {packageData && <BookingForm data={packageData} />}
        </div>
      </div>
    </UserLayout>
  );
}
