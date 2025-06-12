import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function ProtectedLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex gap-x-2 items-center sticky top-0 bg-white shadow z-49">
          <SidebarTrigger />
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
