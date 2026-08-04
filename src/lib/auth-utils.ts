"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "./auth-store";
import { redirect } from "next/navigation";
import AuthModalTrigger from "@/components/auth/AuthModalTrigger";

export function useRequireAuth() {
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const { data: session } = authClient.useSession();


  const requireAuth = (
    callback: () => void, 
    view: "signin" | "signup" = "signin"
  ) => {
    if (!session?.user) {

      openAuthModal(view, callback);
      return false;
    }
    callback();
    return true;
  };

  const requireRole = (
    role: string, 
    callback: () => void
  ) => {
    if (!session?.user) {
      openAuthModal("signin", callback);
      return false;
    }
    
    if (session.user.accountType !== role) {
      console.warn(`Unauthorized: User role ${session.user.accountType} doesn't match required role ${role}`);
      return false;
    }
    
    callback();
    return true;
  };

  return { requireAuth, requireRole };
}


export async function requireAuthServer(role?: string) {
  const { data: session } = await authClient.getSession();
  
  if (!session?.user) {
    AuthModalTrigger();
  }
  
  if (role && session?.user.accountType !== role) {
    redirect("/unauthorized");
  }
  
  return session?.user;
}