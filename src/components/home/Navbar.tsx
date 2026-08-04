"use client";

import { Mail, Phone, ChevronDown, LogOut, LayoutDashboard, Menu } from "lucide-react";
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
import { useAuthStore } from "@/lib/auth-store";

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const openAuthModal = useAuthStore((state) => state.openAuthModal);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const role = user?.accountType;

  const handleSignOut = async () => {
    await authClient.signOut();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const openAuthModalHandler = (view: "signin" | "signup") => {
    openAuthModal(view);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { name: "Browse Flats", href: "/flats" },
    { name: "Find Roommates", href: "/roommates" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <>
      <header className="absolute top-0 left-0 z-50 w-full px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between bg-transparent">
        <div className="container mx-auto flex items-center justify-between w-full gap-2 sm:gap-4">
          
          {/* 1. LOGO (Icon-only on mobile, full branding on sm+) */}
          <Link
            href="/"
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-gray-100 shadow-sm shrink-0"
          >
            <Image
              src="https://i.ibb.co.com/h1nKT2NW/rentease.png"
              alt="Logo"
              height={26}
              width={26}
              className="sm:w-[30px] sm:h-[30px]"
            />
            <span className="hidden sm:inline font-bold text-[#1C1E1B] tracking-tight text-sm">
              RentEase
            </span>
          </Link>

          {/* 2. DESKTOP NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-gray-100 shadow-sm">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`rounded-full text-xs hover:bg-gray-100 font-semibold px-4 h-8 transition-colors ${
                    isActive(link.href)
                      ? "bg-[#4E654C] text-[#F4EFEA] hover:bg-[#4E654C]/90"
                      : "text-zinc-700"
                  }`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-2">
            
            {/* 3. USER / AUTH DROPDOWN */}
            <div className="flex items-center bg-white/80 backdrop-blur-md p-1 rounded-full border border-gray-100 shadow-sm pl-1.5 sm:pl-2 pr-2 sm:pr-3">
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className="flex items-center gap-1.5 sm:gap-2 outline-none focus:outline-none select-none cursor-pointer group">
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7 border">
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
                  <span className="text-xs font-bold text-[#1C1E1B] max-w-[70px] sm:max-w-[90px] truncate hidden xs:inline">
                    {user?.name || "Guest"}
                  </span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-48 p-1.5 rounded-2xl bg-white border border-zinc-200 shadow-xl z-[60]"
                >
                  <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Account Options
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {user ? (
                    <>
                      <Link href={role ? `/${role}` : "/"}>
                        <DropdownMenuItem className="px-2.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer">
                          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="px-2.5 py-1.5 text-xs font-semibold text-red-600 rounded-xl cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={() => openAuthModalHandler("signin")}
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-xl cursor-pointer"
                      >
                        Sign In
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openAuthModalHandler("signup")}
                        className="px-2.5 py-1.5 text-xs font-semibold text-[#4E654C] bg-[#4E654C]/5 rounded-xl cursor-pointer"
                      >
                        Create Account
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 4. CONTACT SECTION (Compact on mobile, expanded on desktop) */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md p-1 rounded-full border border-gray-100 shadow-sm pl-2 sm:pl-4">
              <span className="hidden md:inline text-xs font-medium text-gray-800 tracking-wide">
                rentease@gmail.com
              </span>
              <a
                href="mailto:rentease@gmail.com"
                className="hidden sm:block text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Email support"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="tel:+1234567890"
                className="bg-black text-white p-2 rounded-full cursor-pointer hover:bg-gray-900 transition-colors"
                aria-label="Call support"
              >
                <Phone className="h-3.5 w-3.5 fill-current" />
              </a>
            </div>

            {/* 5. MOBILE MENU TRIGGER BUTTON (Shows only on mobile/tablet < lg) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden bg-white/80 backdrop-blur-md rounded-full border border-gray-100 shadow-sm h-9 w-9 p-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-4 w-4 text-gray-700" />
            </Button>

          </div>
        </div>
      </header>

      {/* MOBILE / TABLET SLIDING MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs flex flex-col justify-start pt-20 px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-gray-100 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="text-[10px] font-bold text-gray-400 uppercase px-3 py-1 tracking-wider">
              Navigation
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive(link.href)
                      ? "bg-[#4E654C] text-[#F4EFEA]"
                      : "text-zinc-700 hover:bg-gray-100"
                  }`}
                >
                  {link.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}