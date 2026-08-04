"use client";

import { useState, useEffect } from "react";
import { Menu, X, LayoutGrid } from "lucide-react";

export default function MobileNavWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Trigger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="border border-gray-200 bg-white text-gray-900 font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-xs transition-transform active:scale-95"
        >
          <Menu className="w-4 h-4 text-[#f15a14]" />
          <span>Menu</span>
        </button>
      </div>

      {/* Drawer Overlay Wrapper */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Darkened Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        />

        {/* 🔴 FORCE SOLID WHITE SIDEBAR DRAWER */}
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] h-full !bg-white border-r border-gray-200 shadow-2xl flex flex-col z-50 transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 bg-black text-white border-b border-gray-800">
            <div className="flex items-center gap-2">
              <div className="bg-[#f15a14] p-1.5 rounded-lg">
                <LayoutGrid className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xs tracking-tight">RentEase Menu</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Solid Drawer Content Area */}
          <div
            className="flex-1 overflow-y-auto p-3 !bg-white text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}