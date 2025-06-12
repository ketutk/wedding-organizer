"use client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Booking, Package } from "@/generated/prisma";
import { FetchData } from "@/lib/fetch";
import { formatNumber } from "@/utility/number";
import { useState } from "react";
import { set } from "zod";
import { useMessage } from "@/app/messageContext";
import { useBookingContext } from "../bookingContext";
import { useLoading } from "@/app/loaderContext";

interface ViewModalProps {
  data: Booking & {
    package: Package | null;
  };
}

export default function ViewModal({ data }: ViewModalProps) {
  const [show, setShow] = useState(false);
  const { showMessage } = useMessage();
  const { isLoading, showLoading } = useLoading();
  const context = useBookingContext();

  async function handleChangeStatus(status: Booking["status"]) {
    await showLoading(async () => {
      try {
        await FetchData(`/api/admin/booking/${data.id}`, "PUT", { status });
        setShow(false);
        showMessage(`Booking successfully updated to ${status}`, "success");
        if (context) {
          context.setShouldRefresh(true);
        }
      } catch (error) {
        if (typeof error === "string") {
          console.error(error);
          showMessage(error, "error");
        } else if (error instanceof Error) {
          console.error(error.message);
          showMessage(error.message, "error");
        }
      }
    });
  }

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition cursor-pointer">View Booking</DialogTrigger>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Booking Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <div className="space-y-2">
            <div>
              <strong>Customer Name:</strong> {data.customerName}
            </div>
            <div>
              <strong>Email:</strong> {data.customerEmail}
            </div>
            <div>
              <strong>Phone:</strong> {data.customerPhone}
            </div>
            <div>
              <strong>Wedding Date:</strong>{" "}
              {new Date(data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div>
              <strong>Package:</strong> {data.package?.name || "N/A"}
            </div>
            <div>
              <strong>Total Payment:</strong> {formatNumber(data.package?.price || 0)}
            </div>
            <div>
              <strong>Status:</strong> <span className={data.status === "Approved" ? "text-green-600 font-medium" : data.status === "Rejected" ? "text-red-600 font-medium" : "text-yellow-600 font-medium"}>{data.status.toUpperCase()}</span>
            </div>
            {data.paymentImage && (
              <div>
                <strong>Payment Proof:</strong>
                <img src={data.paymentImage} alt="Proof of Payment" className="mt-2 rounded border border-gray-300 max-h-48 object-contain" />
              </div>
            )}
          </div>

          {data.status === "Requested" && (
            <>
              <button disabled={isLoading} onClick={() => handleChangeStatus("Approved")} className="px-4 py-2 outline outline-green-600 text-green-600 hover:text-white rounded hover:bg-green-700 transition cursor-pointer">
                Approve Booking
              </button>
              <button disabled={isLoading} onClick={() => handleChangeStatus("Rejected")} className="px-4 py-2 outline outline-red-600 text-red-600 hover:text-white rounded hover:bg-red-700 transition cursor-pointer">
                Reject Booking
              </button>
            </>
          )}
          <button
            disabled={isLoading}
            onClick={() => {
              setShow(false);
            }}
            className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
