import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ReusableModalProps {
  title: string;
  triggerLabel?: string;
  triggerLabelClassname?: string;
  form: ReactNode;
  button: ReactNode;
}

export default function ReusableModal({ title, triggerLabel = "Open Modal", form, button, triggerLabelClassname }: ReusableModalProps) {
  return (
    <Dialog>
      <DialogTrigger className={`px-4 py-2  rounded  cursor-pointer ${triggerLabelClassname || " outline outline-black hover:bg-black hover:text-white"}`}>{triggerLabel}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {form}
        <DialogFooter>{button}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import AddPackageForm from "./AddPackageForm";

// export default function AddModal() {
//   return (
//     <Dialog>
//       <DialogTrigger className="px-4 py-2 outline outline-black rounded hover:bg-black hover:text-white cursor-pointer">Add Package</DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Package</DialogTitle>
//         </DialogHeader>
//         <AddPackageForm />
//         <DialogFooter>
//           <button
//             className="px-4 py-2 outline outline-black rounded hover:bg-black hover:text-white cursor-pointer"
//             onClick={() => {
//               document.getElementById("submit_button")?.click();
//             }}
//           >
//             Submit
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
