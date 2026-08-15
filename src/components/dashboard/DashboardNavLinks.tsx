"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  PlusCircle,
  Users,
  Wallet,
  UserCheck,
  Search,
  User,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export default function DashboardNavLinks({ role }: { role?: string }) {
  const {data : session} = authClient.useSession()
  const user = session?.user
  
  const pathname = usePathname();


  // Role-specific navigation items tailored for RentEase
  const landlordNavLinks: NavItem[] = [
    { icon: LayoutGrid, href: "/landlord", label: "Overview" },
    { icon: Building2, href: "/landlord/properties", label: "My Properties" },
    { icon: PlusCircle, href: "/landlord/add-property", label: "List New Flat" },
    { icon: UserCheck, href: "/landlord/applications", label: "Tenant Requests" },
    // { icon: Wallet, href: "/landlord/earnings", label: "Earnings & Billing" },
    // { icon: User, href: "/landlord/profile", label: "Profile Settings" },
  ];
  
  const renterNavLinks: NavItem[] = [
    { icon: LayoutGrid, href: "/renter", label: "Overview" },
    { icon: Search, href: "/flats", label: "Browse Housing" },
    { icon: Users, href: "/roommates", label: "Find Roommates" },
    { icon: Users, href: "/groups", label: "Find Groups" },
    { icon: FileText, href: "/dashboard/renter/my-applications", label: "My Applications" },
    { icon: User, href: "/renter/profile", label: "My Profile" },
  ];

  if (user?.renterType === "bachelor") {
      renterNavLinks.splice(3, 0, { 
        icon: FileText, 
        href: "/renter/my-group", 
        label: "My Group" 
      });
    }

  const adminNavLinks: NavItem[] = [
    { icon: LayoutGrid, href: "/dashboard/admin", label: "Admin Overview" },
    { icon: Users, href: "/dashboard/admin/manage-users", label: "Manage Users" },
    { icon: Building2, href: "/dashboard/admin/manage-properties", label: "Approve Listings" },
    { icon: ShieldCheck, href: "/dashboard/admin/verifications", label: "ID Verifications" },
    { icon: Wallet, href: "/dashboard/admin/transactions", label: "Transactions" },
  ];

  const navLinksMap: Record<string, NavItem[]> = {
    landlord: landlordNavLinks,
    renter: renterNavLinks,
    admin: adminNavLinks,
  };

  const items = navLinksMap[role || "renter"] || renterNavLinks;

  return (
    <nav className="flex flex-col gap-1.5 w-full">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const IconComponent = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-xs font-semibold transition-all group ${
              isActive
                ? "bg-[#f15a14] text-white shadow-md shadow-orange-500/20"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <IconComponent
              className={`w-4 h-4 transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-400 group-hover:text-gray-700"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}