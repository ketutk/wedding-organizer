"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PaymentInstructionModal() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Dialog open={show} onOpenChange={setShow}>
        <DialogTrigger className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition cursor-pointer">View payment instructions</DialogTrigger>
        <DialogContent className="bg-white text-black max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Payment Instructions</DialogTitle>
          </DialogHeader>

          <p className="mb-4">Please follow the instructions below to complete your payment:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Go to our payment portal. (You're on this page)</li>
            <li>
              Enter your booking details. <span className="text-red-700 font-bold">Input your email and phone correctly as our contact point</span>
            </li>
            <li>Check date availability by clicking the Check Availability button</li>
            <li>Scan Our QRIS</li>
            <img src="/images/qris.png" alt="QRIS Image" className="w-full rounded" />
            <li>Paid exactly like the shown Total Payment on Booking Form</li>
            <li>Screenshot you payment and input the file on the form</li>
            <li>Confirm your booking</li>
            <li>
              Wait for our confirmation. <span className="text-red-700 font-bold">We will contact you via email</span>
            </li>
          </ol>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={() => setShow(false)}>
            Close
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
