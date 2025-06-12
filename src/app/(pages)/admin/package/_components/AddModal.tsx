import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddPackageForm from "./AddPackageForm";
export default function AddModal() {
  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2 outline outline-black rounded hover:bg-black hover:text-white cursor-pointer">Add Package</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Package</DialogTitle>
        </DialogHeader>
        <AddPackageForm />
        <DialogFooter>
          <button
            className="px-4 py-2 outline outline-black rounded hover:bg-black hover:text-white cursor-pointer"
            onClick={() => {
              document.getElementById("submit_button")?.click();
            }}
          >
            Submit
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
