"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

export default function AuthModalTrigger() {
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const router = useRouter();

  useEffect(() => {
    
    openAuthModal("signin", () => {
      router.refresh();
    });
  }, [openAuthModal, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4E654C] mx-auto"></div>
        <p className="mt-4 text-gray-600"> Openning Sign in Page ... </p>
      </div>
    </div>
  );
}