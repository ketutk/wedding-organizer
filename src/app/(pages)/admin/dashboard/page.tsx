"use client";

import { useLoading } from "@/app/loaderContext";
import { useMessage } from "@/app/messageContext";
import { FetchData } from "@/lib/fetch";
import { useEffect, useState } from "react";
import { Box, Calendar, Check, Clock, Package as PackageIcon } from "lucide-react";
import Link from "next/link";
import { Booking, Package, Status } from "@/generated/prisma";

type BookingStats = {
  total: number;
  requested: number;
  approved: number;
};

type DashboardData = {
  total_packages: number;
  booking_stats: BookingStats;
  recent_bookings: (Booking & { package: Package | null })[];
};

export default function AdminDashboard() {
  const { showLoading } = useLoading();
  const { showMessage } = useMessage();
  const [totalPackages, setTotalPackages] = useState<number>(0);
  const [bookingStats, setBookingStats] = useState<BookingStats>({
    total: 0,
    requested: 0,
    approved: 0,
  });
  const [recentBookings, setRecentBookings] = useState<(Booking & { package: Package | null })[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = (await FetchData("/api/admin/dashboard", "GET")) as {
          data: DashboardData;
        };
        setTotalPackages(data.total_packages);
        setBookingStats(data.booking_stats);
        setRecentBookings(data.recent_bookings);
      } catch (error) {
        if (typeof error == "string") {
          showMessage(error, "error");
        } else if (error instanceof Error) {
          showMessage(error.message, "error");
        }
      }
    };

    showLoading(fetch);
  }, []);

  return (
    <div className="p-6 w-full flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Packages Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <PackageIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Packages</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{totalPackages.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{bookingStats.total.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Booking Status Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Booking Status</p>
              <div className="flex gap-4 mt-1">
                <div>
                  <span className="text-xs text-gray-500">Requested</span>
                  <p className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {bookingStats.requested.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Approved</span>
                  <p className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    {bookingStats.approved.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">Latest booking requests</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Package
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.package?.name || "No package"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.date).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === Status.Approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{booking.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {recentBookings.length > 5 ? 5 : recentBookings.length} of {bookingStats.total} bookings
          </p>
          <Link href={"/admin/booking"} className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
            View all
          </Link>
        </div>
      </div>
    </div>
  );
}
