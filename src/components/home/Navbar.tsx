"use client";

import { Grid2X2, Mail, Phone, ChevronDown } from "lucide-react";
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

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full px-6 py-4 flex items-center justify-between bg-transparent">
      <div className="container mx-auto flex items-center justify-between w-full">
        {/* 1. LOGO SECTION */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-100 shadow-sm">
          <Image
            src="https://i.ibb.co.com/h1nKT2NW/rentease.png"
            alt="Logo"
            height={30}
            width={30}
          ></Image>
          <span className="font-semibold text-gray-900 tracking-tight text-sm">
            RentEase
          </span>
        </div>

        {/* 2. NAVIGATION LINKS SECTION */}
        <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-gray-100 shadow-sm">
          <Button
            variant="ghost"
            className="rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 px-4 h-8"
          >
            Browse Flats
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 px-4 h-8"
          >
            Find Roommates
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 px-4 h-8"
          >
            Pricing
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 px-4 h-8"
          >
            About Us
          </Button>
          <Button
            variant="ghost"
            className="rounded-full text-xs font-medium text-gray-700 hover:bg-gray-100 px-4 h-8"
          >
            Contact
          </Button>
        </nav>

        {/* 3. PROFILE / USER DROPDOWN SECTION */}
        <div className="flex items-center bg-white/80 backdrop-blur-md p-1 rounded-full border border-gray-100 shadow-sm pl-2 pr-3 transition-all hover:bg-white/95">
          <DropdownMenu>
            {/* Clean focus management & disabled text selection */}
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none cursor-pointer group">
              <Avatar className="h-7 w-7 border border-gray-100 transition-transform hover:scale-105">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"
                  alt="Alexander Abm"
                />
                <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-600">
                  AA
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-gray-700 tracking-tight">
                Alexander Abm
              </span>
              <ChevronDown className="h-3 w-3 text-gray-400 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>

            {/* Sleeker width (w-40), beautifully rounded (rounded-2xl), and smooth drop-down ease animation */}
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-40 p-1.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-xl origin-top-right transition-all duration-300 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-4"
            >
              <DropdownMenuLabel className="px-2.5 py-1 text-[10px] font-semibold text-gray-400 tracking-wider uppercase">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-gray-100" />

              <DropdownMenuItem className="px-2.5 py-1.5 text-xs font-medium text-gray-700 rounded-xl cursor-pointer transition-colors focus:bg-gray-100 focus:text-gray-900 focus:outline-none">
                Login
              </DropdownMenuItem>
              <DropdownMenuItem className="px-2.5 py-1.5 text-xs font-medium text-gray-700 rounded-xl cursor-pointer transition-colors focus:bg-gray-100 focus:text-gray-900 focus:outline-none">
                Register
              </DropdownMenuItem>
              <DropdownMenuItem className="px-2.5 py-1.5 text-xs font-medium text-gray-700 rounded-xl cursor-pointer transition-colors focus:bg-gray-100 focus:text-gray-900 focus:outline-none">
                Listing
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-gray-100" />
              <DropdownMenuItem className="px-2.5 py-1.5 text-xs font-medium text-red-600 rounded-xl cursor-pointer transition-colors focus:bg-red-50 focus:text-red-700 focus:outline-none">
                Log out
              </DropdownMenuItem>
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
  );
}
