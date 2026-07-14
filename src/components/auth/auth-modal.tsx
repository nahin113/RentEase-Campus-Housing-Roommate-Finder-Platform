"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialView = "signin" }: AuthModalProps) {
  const [view, setView] = useState<"signin" | "signup">(initialView);

  useEffect(() => {
    if (isOpen) setView(initialView);
  }, [isOpen, initialView]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 
        FORCE STRIP RADIX/SHADCN DEFAULT WRAPPERS:
        We drop custom override tags to destroy the structural border shell entirely.
      */}
      <DialogContent className="sm:max-w-[960px] w-[95vw] p-0 border-0 bg-transparent shadow-none [box-shadow:none] !border-none focus:outline-none focus:ring-0 [&>button]:hidden">
        
        {/* INNER WRAPPER CONTAINER: The actual outer visual shell boundary */}
        <div className="w-full flex items-stretch overflow-hidden rounded-[2.5rem] shadow-2xl bg-[#F4EFEA]">
          
          {/* LEFT SIDE: Image Block */}
          <div className="hidden md:flex md:w-5/12 relative items-start p-8 flex-shrink-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="RentEase Branding Asset"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E1B]/40 via-transparent to-transparent" />
            
            <div className="relative z-10 border border-[#F4EFEA]/30 backdrop-blur-md bg-[#1C1E1B]/20 rounded-xl px-4 py-2">
              <span className="text-[#F4EFEA] font-bold text-[10px] uppercase tracking-widest">
                Welcome to RentEase!
              </span>
            </div>
          </div>

          {/* RIGHT SIDE: Dynamic Form Box Container */}
          <div className="w-full md:w-7/12 bg-[#F4EFEA] flex flex-col justify-between p-6 sm:p-10 relative z-10">
            
            {/* Top Navigation Row */}
            <div className="flex justify-end items-center space-x-3 w-full mb-6">
              <span className="text-zinc-500 text-xs font-medium">
                {view === "signin" ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                onClick={() => setView(view === "signin" ? "signup" : "signin")}
                className="border-2 border-[#1C1E1B] text-[#1C1E1B] font-bold text-xs px-4 py-1.5 rounded-full hover:bg-[#1C1E1B] hover:text-[#F4EFEA] transition-all"
              >
                {view === "signin" ? "Register" : "Sign In"}
              </button>
            </div>

            {/* Injected Active Child Form Stack */}
            <div className="w-full max-w-[400px] mx-auto space-y-5 my-auto">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1C1E1B] tracking-tight">
                  {view === "signin" ? "Welcome Back" : "Create Account"}
                </h2>
                {view === "signin" && (
                  <p className="text-zinc-500 text-xs mt-1">
                    Sign in to manage your premium flat dashboard settings.
                  </p>
                )}
              </div>

              {view === "signin" ? (
                <SignInForm onSuccess={onClose} />
              ) : (
                <SignUpForm onSuccess={onClose} />
              )}
            </div>

            {/* Signature Copyright Row */}
            <div className="text-center pt-6">
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
                &copy; 2026 RentEase Inc. All rights reserved.
              </span>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}