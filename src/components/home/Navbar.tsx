"use client";

import { Mail, Phone, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import AuthModal from "@/components/auth/auth-modal"; // Import Modal

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  
  // Modal Controller States
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalView, setAuthModalView] = useState<"signin" | "signup">("signin");

  const { data: session } = authClient.useSession();
  const user = session?.user;
  // const role = user?.accountType;

  const handleSignOut = async () => {
    await authClient.signOut();
    setDropdownOpen(false);
  };

  const openAuthModal = (view: "signin" | "signup") => {
    setAuthModalView(view);
    setAuthModalOpen(true);
    setDropdownOpen(false); // Close dropdown if accessed via responsive options
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className="absolute top-0 left-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-transparent">
        <div className="container mx-auto flex items-center justify-between w-full gap-4">
          {/* 1. LOGO */}
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm"
          >
            <Image
              src="https://i.ibb.co.com/h1nKT2NW/rentease.png"
              alt="Logo"
              height={30}
              width={30}
            />
            <span className="font-bold text-[#1C1E1B] tracking-tight text-sm">
              RentEase
            </span>
          </Link>

          {/* 2. LINKS */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-gray-100 shadow-sm">
            {[
              { name: "Browse Flats", href: "/flats" },
              { name: "Find Roommates", href: "/roommates" },
              { name: "Pricing", href: "/pricing" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`rounded-full text-xs hover:bg-gray-100 font-semibold px-4 h-8 ${
                    isActive(link.href)
                      ? "bg-[#4E654C] text-[#F4EFEA]"
                      : "text-zinc-700"
                  }`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* 3. AUTH / DROPDOWN BAR SYSTEM */}
          <div className="flex items-center bg-white/80 backdrop-blur-md p-1 rounded-full border border-gray-100 shadow-sm pl-2 pr-3">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger className="flex items-center gap-2 outline-none focus:outline-none select-none cursor-pointer group">
                <Avatar className="h-7 w-7 border">
                  <AvatarImage
                    src={
                      user?.image ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                    }
                  />
                  <AvatarFallback className="text-[10px] font-bold">
                    RE
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-bold text-[#1C1E1B] max-w-[90px] truncate">
                  {user?.name || "Guest Account"}
                </span>
                <ChevronDown className="h-3 w-3 text-zinc-400" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44 p-1.5 rounded-2xl bg-white border border-zinc-200 shadow-xl"
              >
                <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Account Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {user ? (
                  <>
                    <Link href="/dashboard">
                      <DropdownMenuItem className="px-2.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-2">
                        <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="px-2.5 py-1.5 text-xs font-semibold text-red-600 rounded-xl"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Log Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {/* Integrated Dynamic Custom Modal Triggers */}
                    <DropdownMenuItem
                      onClick={() => openAuthModal("signin")}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Sign In
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openAuthModal("signup")}
                      className="px-2.5 py-1.5 text-xs font-semibold text-[#4E654C] bg-[#4E654C]/5 rounded-xl cursor-pointer"
                    >
                      Create Account
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 4. CONTACT SECTION */}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-1 rounded-full border border-gray-100 shadow-sm pl-4">
            <span className="text-xs font-medium text-gray-800 tracking-wide">
              rentease@gmail.com
            </span>
            <button className="text-gray-500 hover:text-gray-800 transition-colors">
              <Mail className="h-4 w-4" />
            </button>
            <div className="bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-900 transition-colors">
              <Phone className="h-3.5 w-3.5 fill-current" />
            </div>
          </div>
        </div>
      </header>

      {/* 4. AUTH MODAL PORTAL PORT ENTRY */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalView}
      />
    </>
  );
}