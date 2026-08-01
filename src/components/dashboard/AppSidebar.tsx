"use client"

import { LayoutGrid, BedDouble, Users, CreditCard, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-100 bg-white/50 backdrop-blur-xl">
      {/* Sidebar Header: Matches Navbar Style */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-lg">
          <LayoutGrid className="h-4 w-4" />
          <span className="font-semibold text-xs tracking-tight">RentEase Admin</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {[
                { title: "Dashboard", icon: LayoutGrid },
                { title: "Browse Flats", icon: BedDouble },
                { title: "Roommates", icon: Users },
                { title: "Billing", icon: CreditCard },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    className="rounded-full hover:bg-gray-100/80 transition-all font-medium text-gray-700"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenuButton className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}