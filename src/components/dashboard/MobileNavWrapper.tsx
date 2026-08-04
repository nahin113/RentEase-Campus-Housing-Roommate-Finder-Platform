"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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
      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="border border-gray-200 bg-white/90 backdrop-blur-md text-gray-800 hover:bg-gray-50 font-semibold px-3.5 py-2 rounded-full shadow-md flex items-center gap-2 text-xs transition-colors"
        >
          <Menu className="w-4 h-4 text-[#f15a14]" />
          <span>Menu</span>
        </button>
      </div>

      {/* Sliding Drawer Container */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Ambient Dark Overlay */}
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        />

        {/* Sliding Side Panel */}
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] h-full bg-white border-r border-gray-100 p-5 shadow-2xl flex flex-col transition-transform duration-300 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <span className="font-bold text-xs tracking-wider uppercase text-gray-400">
              Dashboard Navigation
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Embedded Nav Items */}
          <div
            className="flex-1 overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}