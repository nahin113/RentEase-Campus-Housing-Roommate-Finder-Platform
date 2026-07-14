"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

interface SignInFormProps {
  onSuccess?: () => void;
}

export function SignInForm({ onSuccess }: SignInFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      toast.success("Welcome back to RentEase!");
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      toast.error("An unexpected error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({ provider: "google" });
  };

  return (
    <div className="space-y-5 w-full">
      {/* Social Login */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleGoogleSignIn}
          type="button"
          className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
        >
          <FcGoogle className="w-4 h-4" />
          <span>Google</span>
        </button>
        <button
          type="button"
          disabled
          className="bg-white opacity-50 cursor-not-allowed border border-zinc-200 text-zinc-400 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm"
        >
          <span className="text-blue-600 font-black text-sm">f</span>
          <span>Facebook</span>
        </button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-zinc-300"></div>
        <span className="flex-shrink mx-4 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">or email</span>
        <div className="flex-grow border-t border-zinc-300"></div>
      </div>

      {/* Inputs */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
          <div className="p-3.5">
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full bg-transparent text-[#1C1E1B] placeholder-zinc-400 focus:outline-none text-sm"
            />
          </div>
          <div className="p-3.5 flex items-center justify-between">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="Password"
              className="w-full bg-transparent text-[#1C1E1B] placeholder-zinc-400 focus:outline-none text-sm pr-4"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-zinc-400 hover:text-zinc-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1C1E1B] text-[#F4EFEA] hover:bg-zinc-800 font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}