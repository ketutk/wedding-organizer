"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

import { BookingSchema } from "../schema"; // adjust this path if needed
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package } from "@/generated/prisma";
import { formatNumber } from "@/utility/number";
import Link from "next/link";
import { FetchData } from "@/lib/fetch";
import { useLoading } from "@/app/loaderContext";
import { useMessage } from "@/app/messageContext";
import PaymentInstructionModal from "./PaymentInstructionModal";

type BookingFormData = z.infer<typeof BookingSchema>;
interface BookingFormProps {
  data: Package;
}
export default function BookingForm({ data }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const { showLoading } = useLoading();
  const { showMessage } = useMessage();
  const [image, setImage] = useState<File | null>(null);

  const datePlusSeven = new Date().setDate(new Date().getDate() + 7); // Set minimum date to tomorrow

  const form = useForm<BookingFormData>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      date: undefined,
    },
  });

  const onSubmit = async (values: BookingFormData) => {
    await showLoading(async () => {
      setIsSubmitting(true);
      try {
        console.log("Booking submitted:", values);
        const formData = new FormData();
        formData.append("customerName", values.customerName);
        formData.append("customerPhone", values.customerPhone);
        formData.append("customerEmail", values.customerEmail);
        formData.append("date", values.date.toISOString());

        if (image) {
          formData.append("image", image);
        }

        const response = await FetchData(`/api/booking/${data.id}`, "POST", formData);
        showMessage("Booking confirmed successfully", "success");
        form.reset();
        setImage(null); // Reset image after successful submission
      } catch (error) {
        if (typeof error === "string") {
          showMessage(error, "error");
        } else if (error instanceof Error) {
          showMessage(error.message, "error");
        }
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  useEffect(() => {
    const checkAvailability = async () => {
      await showLoading(async () => {
        try {
          const response = (await FetchData(`/api/booking/${data.id}/check`, "POST", { date: form.watch("date")?.toLocaleDateString() })) as { data: { isAvailable: boolean } };
          setIsAvailable(response.data.isAvailable);
          if (!response.data.isAvailable) {
            showMessage("This package is not available for booking on the selected date", "error");
          }
        } catch (error) {
          if (typeof error === "string") {
            showMessage(error, "error");
          } else if (error instanceof Error) {
            showMessage(error.message, "error");
          }
        }
      });
    };

    if (form.watch("date")) {
      checkAvailability();
    }
  }, [form.watch("date")]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Booking Information</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number </FormLabel>
                <FormControl>
                  <Input placeholder="081XXXXXXXXXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wedding Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={new Date(datePlusSeven).toISOString().split("T")[0]}
                    {...field}
                    value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={`flex flex-col gap-2 ${!isAvailable && "hidden"}`}>
            <FormLabel>Proof of Payment / Image Upload</FormLabel>
            <Input
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImage(file);
              }}
            />

            {image && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Selected file: {image.name}</p>
                <img src={URL.createObjectURL(image)} alt="Preview" className="mt-2 rounded-md max-h-48 object-contain border border-gray-300" />
              </div>
            )}
          </div>
          <PaymentInstructionModal />
          <div>
            <FormLabel>Total Payment</FormLabel>
            <p className="font-bold text-2xl">{formatNumber(data.price)}</p>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 bg-pink-500 text-white rounded cursor-pointer hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </button>
        </form>
      </Form>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="font-medium text-gray-800 mb-3">Booking Terms</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <svg className="w-4 h-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>After booking, you will receive an email to check your booking status</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-pink-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>After your booking is accepted, we will contact you by phone</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
