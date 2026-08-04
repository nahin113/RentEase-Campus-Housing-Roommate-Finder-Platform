"use client";

import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("./auth-modal"), { ssr: false });

export default function AuthModalProvider() {
  return <AuthModal />;
}
