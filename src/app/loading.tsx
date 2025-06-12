import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] pointer-events-auto">
      <Loader2 className="animate-spin text-white w-12 h-12" />
    </div>
  );
}
