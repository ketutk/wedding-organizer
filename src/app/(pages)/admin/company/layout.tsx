import ProtectedLayout from "@/app/_components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saranin Admin | Company",
  description: "Saranin Yuk",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout children={children} title="Admin Company" />;
}
