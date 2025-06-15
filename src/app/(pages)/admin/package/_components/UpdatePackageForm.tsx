import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FetchData } from "@/lib/fetch";
import { useMessage } from "@/app/messageContext";
import { Textarea } from "@/components/ui/textarea";
import { PackageSchema } from "../schema";
import { useState } from "react";
import { usePackageContext } from "../packageContext";
import { useLoading } from "@/app/loaderContext";
import { Package } from "@/generated/prisma";

interface UpdateFormProps {
  data: Package;
}

export default function UpdatePackageForm({ data }: UpdateFormProps) {
  const { showMessage } = useMessage();
  const { showLoading } = useLoading();
  const context = usePackageContext();
  const [image, setImage] = useState<File | null>(null);

  const form = useForm<z.infer<typeof PackageSchema>>({
    resolver: zodResolver(PackageSchema),
    defaultValues: {
      name: data.name || "",
      description: data.description || "",
      price: data.price.toString() || "0",
    },
  });

  async function onSubmit(values: z.infer<typeof PackageSchema>) {
    await showLoading(async () => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("price", values.price);
        if (image) {
          formData.append("image", image);
        }

        await FetchData(`/api/admin/package/${data.id}`, "PUT", formData);
        if (context) {
          context.setShouldRefresh(true);
        }
        showMessage("Package updated successfully", "success");
      } catch (error) {
        if (typeof error === "string") {
          showMessage(error, "error");
        } else if (error instanceof Error) {
          showMessage(error.message, "error");
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form submission errors:", errors);
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Input here..." {...field} />
              </FormControl>
              <FormDescription>Input the package name here</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Input here..." className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Input here..." {...field} />
              </FormControl>
              <FormDescription>Input the package price here</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4">
          <FormLabel>Package Image</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setImage(file);
            }}
          />

          {image ? (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Selected: {image.name}</p>
              <img src={URL.createObjectURL(image)} alt="Preview" className="mt-2 rounded-md max-h-48 object-contain border border-gray-300" />
            </div>
          ) : data.image ? (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Current image:</p>
              <img src={data.image} alt="Current package image" className="mt-2 rounded-md max-h-48 object-contain border border-gray-300" />
            </div>
          ) : null}
        </div>

        <Button type="submit" className="hidden" id="update_package_button">
          Update Package
        </Button>
      </form>
    </Form>
  );
}
