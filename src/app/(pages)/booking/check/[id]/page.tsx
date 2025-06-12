"use client";

import UserLayout from "@/app/_components/userLayout";
import { useLoading } from "@/app/loaderContext";
import { useMessage } from "@/app/messageContext";
import { FetchData } from "@/lib/fetch";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Booking } from "@/generated/prisma";
import { formatNumber } from "@/utility/number";

type BookingWithPackage = Booking & {
  package: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  } | null;
};

export default function CheckBookingPage() {
  const { id } = useParams();
  const { showMessage } = useMessage();
  const { showLoading } = useLoading();

  const [booking, setBooking] = useState<BookingWithPackage | null>(null);

  useEffect(() => {
    const fetch = async () => {
      await showLoading(async () => {
        try {
          const response = (await FetchData(`/api/booking/${id}`, "GET", null)) as { data: BookingWithPackage };
          setBooking(response.data);
        } catch (error) {
          if (typeof error === "string") {
            showMessage(error, "error");
          } else if (error instanceof Error) {
            showMessage(error.message, "error");
          }
        }
      });
    };

    fetch();
  }, []);

  return (
    <UserLayout>
      <div className=" bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Booking Details</h1>

          {booking ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Header Section */}
              <div className="bg-pink-600 p-6 text-white">
                <h2 className="text-2xl font-semibold">Booking #{booking.id}</h2>
                <div className="flex items-center mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === "Approved" ? "bg-green-100 text-green-800" : booking.status === "Requested" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                  >
                    {booking.status}
                  </span>
                  <span className="ml-4">Created on: {new Date(booking.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-gray-800 font-medium">{booking.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{booking.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Event Date</p>
                        <p className="text-gray-800 font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Package Information */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Package Details</h3>
                    {booking.package ? (
                      <div className="flex items-start">
                        {booking.package.image && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                            <img
                              src={booking.package.image}
                              alt={booking.package.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/default-wedding.jpg";
                              }}
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">{booking.package.name}</h4>
                          <p className="text-pink-600 font-bold">{formatNumber(booking.package.price)}</p>
                          <p className="text-sm text-gray-500 mt-1">Package ID: {booking.package.id}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">No package information available</p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Booking ID</p>
                      <p className="text-gray-800 font-medium">{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-gray-800 font-medium">{new Date(booking.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">Print Details</button>
                <button className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors">Contact Support</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Loading booking details...</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
