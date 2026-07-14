"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSquareXTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from "react-icons/io";
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-[#09090b] text-white px-6 md:px-16 py-16 font-sans border-t border-zinc-900">
      <div className="container mx-auto">
        {/* --- TOP SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-12">
          {/* Brand Pitch & Button */}
          <div className="max-w-xl space-y-5">
            <div className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-1.5">
              Rent<span className="text-[#f15a14]">Ease</span>
            </div>
            <p className="text-base md:text-lg font-light leading-relaxed text-zinc-400">
              RentEase simplifies the housing search process while providing
              transparency, safety, and convenience for both students and
              property owners.
            </p>
            <Link href="/browse" className="inline-block">
              <Button
                variant="outline"
                className="rounded-full bg-transparent border-zinc-800 text-white hover:bg-[#f15a14] hover:border-transparent hover:text-white transition-all px-6 py-5 text-xs font-bold"
              >
                Browse Homes
              </Button>
            </Link>
          </div>

          {/* Social Pill Links */}
          <div className="space-y-3">
            <span className="text-[10px] text-zinc-500 block font-bold uppercase tracking-widest">
              Follow us
            </span>
            <div className="flex flex-wrap gap-3 text-zinc-400">
              <Link href="#" className="hover:text-white transition-colors">
                <FaSquareInstagram size={28} />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaFacebookSquare size={28} />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <FaSquareXTwitter size={28} />
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                <IoLogoYoutube size={30} />
              </Link>
            </div>
          </div>
        </div>

        {/* --- DIVIDER LINE --- */}
        <hr className="border-zinc-900 my-10" />

        {/* --- MIDDLE SECTION (LINKS & NEWSLETTER) --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Company Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              RentEase
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Student Life Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Neighborhoods Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              Neighborhoods
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Jatinangor Campus
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  ITB / Bandung Area
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Coblong District
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Desk Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              Help Center
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  FAQs & Guides
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Submit Support Ticket
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold tracking-widest text-white uppercase">
              Join Newsletter
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Get weekly updates on rent protection guides and hot listings.
            </p>

            {/* Custom Capsule Embedded Input Container using RentEase Accent Color */}
            <div className="flex items-center bg-zinc-900 rounded-full p-1 border border-zinc-800 max-w-sm w-full">
              <Input
                type="email"
                placeholder="Student email address"
                className="bg-transparent border-0 text-white placeholder-zinc-500 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs h-8 px-3 rounded-full w-full"
              />
              <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white text-xs font-bold rounded-full h-8 px-5 transition-colors">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500 border-t border-zinc-900 pt-8">
          <div>© 2026 RentEase Inc. All rights reserved.</div>
          <div>
            <a
              href="mailto:info@rentease.com"
              className="hover:text-white transition-colors font-medium"
            >
              info@rentease.com
            </a>
          </div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Terms
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-white transition-colors">
              Help Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}