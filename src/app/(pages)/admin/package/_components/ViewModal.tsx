import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package } from "@/generated/prisma";
import { FetchData } from "@/lib/fetch";
import { formatNumber } from "@/utility/number";
import { useState } from "react";
import { set } from "zod";
import { usePackageContext } from "../packageContext";
import { useMessage } from "@/app/messageContext";
import { useLoading } from "@/app/loaderContext";

interface ViewModalProps {
  data: Package;
}

export default function ViewModal({ data }: ViewModalProps) {
  const [show, setShow] = useState(false);
  const context = usePackageContext();
  const { showMessage } = useMessage();
  const { showLoading } = useLoading();

  async function handleDelete() {
    await showLoading(async () => {
      try {
        await FetchData(`/api/admin/package/${data.id}`, "DELETE", null);
        setShow(false);
        if (context) {
          context.setShouldRefresh(true);
        }
        showMessage("Package deleted successfully", "success");
      } catch (error) {
        if (typeof error === "string") {
          console.error(error);
        } else if (error instanceof Error) {
          console.error(error.message);
        }
      }
    });
  }
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger className="px-4 py-2 outline outline-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-white transition cursor-pointer">View Package</DialogTrigger>
      <DialogContent className="bg-white text-black max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Package Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="font-semibold">Name</p>
            <p>{data.name}</p>
          </div>

          <div>
            <p className="font-semibold">Description</p>
            <p>{data.description}</p>
          </div>

          <div>
            <p className="font-semibold">Price</p>
            <p>{formatNumber(data.price)}</p>
          </div>

          <div>
            <p className="font-semibold">Created At</p>
            <p>{new Date(data.createdAt).toLocaleString()}</p>
          </div>

          <div>
            <p className="font-semibold">Image</p>
            <img src={data.image} alt="Package Image" className="mt-2 max-h-48 object-contain rounded border border-gray-200" />
          </div>
          <button onClick={handleDelete} className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition cursor-pointer">
            Delete Package
          </button>
          <button
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
