"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white px-6 md:px-16 py-12 font-sans">
      {/* --- TOP SECTION --- */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-12">
        {/* Brand Pitch & Button */}
        <div className="max-w-xl space-y-6">
          <p className="text-xl md:text-2xl font-light leading-relaxed tracking-wide text-gray-200">
            RentEase simplifies the housing search process while providing
            transparecy, security and convenience for both tenants and property
            owners
          </p>
          <Button
            variant="outline"
            className="rounded-full bg-transparent border-gray-700 text-white hover:bg-white hover:text-black transition-colors px-6 py-5 text-xs font-medium"
          >
            Get Started
          </Button>
        </div>

        {/* Social Pill Links */}
        <div className="space-y-3">
          <span className="text-xs text-gray-400 block font-medium tracking-wider">
            Follow us
          </span>
          <div className="flex flex-wrap gap-2">
            {["Instagram", "Facebook", "Twitter", "Youtube"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-xs bg-zinc-800/60 text-gray-300 px-4 py-2 rounded-full border border-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* --- DIVIDER LINE --- */}
      <hr className="border-zinc-800 my-10" />

      {/* --- MIDDLE SECTION (LINKS & NEWSLETTER) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {/* Company Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wide text-white">
            Company
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* About Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wide text-white">
            About
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Benefits
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Team
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Careers
              </Link>
            </li>
          </ul>
        </div>

        {/* Help Center Column */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wide text-white">
            Help Center
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Community
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Knowledge Base
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Academy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-white transition-colors">
                Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4 col-span-2 md:col-span-1">
          <h4 className="text-sm font-semibold tracking-wide text-white">
            Newsletter
          </h4>

          {/* Custom Capsule Embedded Input Container */}
          <div className="flex items-center bg-zinc-800/80 rounded-full p-1 border border-zinc-800 max-w-sm w-full">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent border-0 text-white placeholder-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs h-8 px-3 rounded-full w-full"
            />
            <Button className="bg-[#d31e1e] hover:bg-[#b01616] text-white text-xs font-medium rounded-full h-8 px-5 transition-colors">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-400 border-t border-transparent pt-4">
        <div>©2024 All right reserved</div>
        <div>
          <a
            href="mailto:info@uncabin.com"
            className="hover:text-white transition-colors"
          >
            info@uncabin.com
          </a>
        </div>
        <div>
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
