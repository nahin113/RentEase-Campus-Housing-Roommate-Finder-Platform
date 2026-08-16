"use client";

import Link from "next/link";
import { LayoutGrid, LogOut } from "lucide-react";
import DashboardNavLinks from "./DashboardNavLinks";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

interface AppSidebarProps {
  role?: "landlord" | "renter" | "admin";
}

export function AppSidebar({ role = "renter" }: AppSidebarProps) {
  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <Sidebar className="border-r border-gray-100 bg-white z-50">
      {/* Header Badge */}
      <SidebarHeader className="p-4 bg-white">
        <Link href="/" className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full shadow-md hover:bg-gray-900 transition-colors">
          <LayoutGrid className="h-4 w-4 text-[#f15a14]" />
          <span className="font-bold text-xs tracking-tight">
            RentEase <span className="capitalize text-gray-400">({role})</span>
          </span>
        </Link>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent className="px-3 bg-white">
        <SidebarGroup className="bg-white">
          <SidebarGroupContent className="bg-white">
            <DashboardNavLinks role={role} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Logout */}
      <SidebarFooter className="p-4 border-t border-gray-100 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}