"use client";

import { useAuth } from "@/app/authContext";
import { useLoading } from "@/app/loaderContext";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, Inbox, Calendar, Search, Settings, ArrowRightFromLine, TextSelect } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export function AppSidebar() {
  const { logout, getAuth } = useAuth();
  const { showLoading } = useLoading();
  const router = useRouter();
  const [menus, setMenus] = useState([
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "Manage Package",
      url: "/admin/package",
      icon: Inbox,
    },
    {
      title: "Manage Bookings",
      url: "/admin/booking",
      icon: Calendar,
    },
    {
      title: "Reports",
      url: "/admin/report",
      icon: TextSelect,
    },
    {
      title: "Logout",
      url: "/api/logout",
      icon: ArrowRightFromLine,
    },
  ]);

  const handleClick = (url: string) => {
    if (url === "/api/logout") {
      logout();
    }
    showLoading(async () => router.push(url));
  };

  return (
    <Sidebar variant="sidebar" className="bg-white shadow-lg">
      <SidebarContent className="bg-gradient-to-b from-white via-purple-50 to-pink-300">
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-center py-6 mt-4">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-pink-500">Ever</span>
              <span className="text-gray-600">After</span>
            </h1>
          </SidebarGroupLabel>
        </SidebarGroup>

        <SidebarGroupContent className="px-2 mt-4">
          <SidebarMenu className="space-y-1">
            {menus &&
              menus.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                text-gray-700 hover:text-green-700 
                hover:bg-white hover:shadow-sm
                transition-all duration-200
                rounded-lg
                cursor-pointer
              `}
                  >
                    <button onClick={() => handleClick(item.url)} className="w-full flex items-center gap-3 px-4 py-3">
                      <span className="text-lg">{item.icon && React.createElement(item.icon)}</span>
                      <span className="font-medium">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroup className="mt-auto pb-4">{/* Optional: Add user profile or additional items here */}</SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
