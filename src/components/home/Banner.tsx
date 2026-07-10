"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextType from "../TextType";
import { CalendarDays, CircleDollarSign, MapPin } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative w-full h-[85vh] min-h-137.5 flex flex-col justify-between px-6 md:px-16 pt-32 pb-12 overflow-hidden">
      {/* 1. BACKGROUND IMAGE & OVERLAY */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/banner.jpg"
          alt="Premium campus housing interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark radial gradient matrix overlay to maintain modern accessibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      <div className="py-30 space-y-30">
        {/* 2. TEXT CONTENT OVERLAY */}
        <div className="container mx-auto relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Heading matching project guidelines */}
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
              Find Your Perfect <br />
              <TextType
                text={["Campus Home", "Roommate Match", "Student Housing"]}
                className="text-[#f15a14]"
                typingSpeed={75}
                deletingSpeed={50}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
                cursorBlinkDuration={0.5}
              />
            </h1>

            {/* Two mandatory CTA buttons from project document[cite: 1] */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-[#f15a14] hover:bg-[#d6480a] text-white font-semibold rounded-full px-6 text-sm transition-transform active:scale-95"
              >
                <Link href="/dashboard/landlord/add-property">
                  List a Property
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md font-semibold rounded-full px-6 text-sm transition-transform active:scale-95"
              >
                <Link href="/properties">Browse Housing</Link>
              </Button>
            </div>
          </div>

          {/* Supporting description right column */}
          <div className="lg:col-span-4 lg:pt-4">
            <p className="text-base sm:text-lg font-medium text-gray-200 max-w-sm leading-relaxed">
              Secure verified off-campus spaces and match with compatible
              roommates based on your budget and habits.
            </p>
          </div>
        </div>

        {/* 3. FLOATING COMPACT SEARCH BAR FILTER CARD */}
        <div className="relative z-10 w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            {/* Location Field Column */}
            <div className="md:col-span-4 space-y-2 text-left">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 pl-1">
                <MapPin /> Campus Location
              </label>
              <Select>
                <SelectTrigger className="w-full bg-gray-50 border border-gray-100 h-11 text-gray-700 rounded-xl text-xs transition-colors hover:bg-gray-100/70 focus:ring-0 focus:ring-offset-0 focus:outline-none">
                  <SelectValue placeholder="Search near university area" />
                </SelectTrigger>
                {/* viewport position locked to the input container width */}
                <SelectContent className="rounded-xl bg-white border border-gray-100 shadow-xl max-h-60 min-w-[var(--radix-select-trigger-width)]">
                  <SelectItem
                    value="boston"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    Boston University Area
                  </SelectItem>
                  <SelectItem
                    value="austin"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    UT Austin Area
                  </SelectItem>
                  <SelectItem
                    value="berkeley"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    UC Berkeley Area
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Move-in Date Field Column */}
            <div className="md:col-span-3 space-y-2 text-left">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 pl-1">
                <CalendarDays /> Move-in Date
              </label>
              <Select>
                <SelectTrigger className="w-full bg-gray-50 border border-gray-100 h-11 text-gray-700 rounded-xl text-xs transition-colors hover:bg-gray-100/70 focus:ring-0 focus:ring-offset-0 focus:outline-none">
                  <SelectValue placeholder="Select target window" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white border border-gray-100 shadow-xl min-w-[var(--radix-select-trigger-width)]">
                  <SelectItem
                    value="immediate"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    Immediate Move-in
                  </SelectItem>
                  <SelectItem
                    value="fall"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    Fall Semester
                  </SelectItem>
                  <SelectItem
                    value="spring"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    Spring Semester
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range Field Column */}
            <div className="md:col-span-3 space-y-2 text-left">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 pl-1">
                <CircleDollarSign /> Max Budget
              </label>
              <Select>
                <SelectTrigger className="w-full bg-gray-50 border border-gray-100 h-11 text-gray-700 rounded-xl text-xs transition-colors hover:bg-gray-100/70 focus:ring-0 focus:ring-offset-0 focus:outline-none">
                  <SelectValue placeholder="Select budget ceiling" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white border border-gray-100 shadow-xl min-w-[var(--radix-select-trigger-width)]">
                  <SelectItem
                    value="low"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    $300 - $600 / mo
                  </SelectItem>
                  <SelectItem
                    value="mid"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    $600 - $1,000 / mo
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="text-xs py-2.5 rounded-lg focus:bg-gray-50 focus:text-gray-900 cursor-pointer"
                  >
                    $1,000+ / mo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Button Column */}
            <div className="md:col-span-2">
              <Button className="w-full h-11 bg-[#f15a14] hover:bg-[#d6480a] text-white text-xs font-bold rounded-xl tracking-wide shadow-md shadow-orange-600/10 transition-all active:scale-95">
                Discover
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
