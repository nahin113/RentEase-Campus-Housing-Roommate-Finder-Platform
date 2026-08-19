"use client";

import { useState, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserCircle, Home, ArrowUpToLine, Plus, X, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const SUGGESTED_HABITS = ["Non-smoker", "Pet friendly", "Quiet study hours", "Early bird", "Night owl", "No parties"];

interface SignUpFormProps {
  onSuccess?: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"renter" | "landlord">("renter");
  const [passwordError, setPasswordError] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // OTP State Management
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState<string>("");

  // Custom Habits States
  const [habits, setHabits] = useState<string[]>([]);
  const [habitInput, setHabitInput] = useState<string>("");

  // Form Field Store for OTP Step
  const [formDataState, setFormDataState] = useState<{
    name: string;
    email: string;
    password: string;
    bio: string;
  }>({ name: "", email: "", password: "", bio: "" });

  const [errors] = useState({ logo: "" });

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setLogoUrl(data.data.url);
        toast.success("Profile photo uploaded!");
      }
    } catch {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddHabit = (val: string) => {
    const cleaned = val.trim();
    if (cleaned && !habits.includes(cleaned)) {
      setHabits([...habits, cleaned]);
    }
    setHabitInput("");
  };

  const handleRemoveHabit = (indexToRemove: number) => {
    setHabits(habits.filter((_, index) => index !== indexToRemove));
  };

  // Step 1: Request OTP and switch UI mode
  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const bio = (formData.get("bio") as string) || "";

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    // Save fields in component state for final signup submission
    setFormDataState({ name, email, password, bio });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const resData = await response.json();

      if (!response.ok) {
        toast.error(resData.message || "Failed to send OTP.");
        return;
      }

      toast.success("Verification code sent to your email!");
      setStep("otp");
    } catch {
      toast.error("An error occurred while requesting OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP and complete account registration
  const handleVerifyAndSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Verify OTP with Backend
      const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formDataState.email, otp: otpCode }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        toast.error(verifyData.message || "Invalid or expired OTP.");
        setIsLoading(false);
        return;
      }

      // 2. Register Account via Auth Client
      const { error } = await authClient.signUp.email({
        email: formDataState.email,
        password: formDataState.password,
        name: formDataState.name,
        image: logoUrl || undefined,
        accountType: selectedRole,
        bio: formDataState.bio || undefined,
        ...(selectedRole === "renter" && { habits }),
      });

      if (error) {
        console.error("Sign-up payload error detail:", error);
        toast.error(error.message || "Validation failed.");
        return;
      }

      toast.success("Account created and verified successfully!");
      if (onSuccess) onSuccess();
      router.refresh();
    } catch {
      toast.error("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuggestions = habitInput.trim()
    ? SUGGESTED_HABITS.filter(
        (item) => item.toLowerCase().includes(habitInput.toLowerCase()) && !habits.includes(item)
      )
    : [];

  // Render Step 2: OTP Entry Form
  if (step === "otp") {
    return (
      <form onSubmit={handleVerifyAndSignUp} className="space-y-6 w-full text-left">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 text-center space-y-4">
          <div className="w-12 h-12 bg-[#4E654C]/10 rounded-full flex items-center justify-center mx-auto text-[#4E654C]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#1C1E1B] text-lg">Verify Your Email</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Enter the 6-digit verification code sent to <br />
              <span className="font-semibold text-zinc-700">{formDataState.email}</span>
            </p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            placeholder="0 0 0 0 0 0"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center tracking-[12px] text-2xl font-bold py-3 bg-zinc-50 rounded-xl border border-zinc-200 focus:border-[#4E654C] focus:outline-none"
          />

          <div className="flex justify-between items-center text-xs pt-2">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="text-zinc-400 hover:text-zinc-600 font-medium"
            >
              ← Edit details
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otpCode.length < 6}
          className="w-full bg-[#1C1E1B] text-[#F4EFEA] hover:bg-zinc-800 font-bold py-3.5 px-8 rounded-xl text-sm transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-center"
        >
          {isLoading ? "Verifying..." : "Verify & Complete Registration"}
        </button>
      </form>
    );
  }

  // Render Step 1: Initial Registration Form
  return (
    <form onSubmit={handleRequestOtp} className="space-y-6 w-full text-left">
      {/* Consolidated Input Group Box */}
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 divide-y divide-zinc-100 overflow-hidden">
        <div className="p-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            className="w-full bg-transparent text-[#1C1E1B] placeholder-zinc-400 focus:outline-none text-sm"
          />
        </div>
        <div className="p-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className="w-full bg-transparent text-[#1C1E1B] placeholder-zinc-400 focus:outline-none text-sm"
          />
        </div>
        <div className="p-4 flex items-center justify-between">
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
      {passwordError && (
        <span className="text-red-600 text-xs block font-semibold">{passwordError}</span>
      )}

      {/* Avatar Attachment Container */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-zinc-200 flex items-center gap-4">
        <label className="w-12 h-12 border-2 border-dashed border-zinc-300 hover:border-[#4E654C] bg-zinc-50 rounded-xl flex items-center justify-center cursor-pointer transition-colors group relative overflow-hidden flex-shrink-0">
          <input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="hidden" />
          {logoUrl ? (
            <img src={logoUrl} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ArrowUpToLine size={16} className="text-zinc-400 group-hover:text-[#4E654C]" />
          )}
        </label>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-zinc-700">
            {isUploading ? "Uploading..." : "Upload Profile Photo"}
          </span>
          <span className="text-[11px] text-zinc-400">Max 5MB (JPG, PNG)</span>
          {errors.logo && <span className="text-[11px] text-red-500 font-medium">{errors.logo}</span>}
        </div>
      </div>

      {/* Custom Role Selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase block">
          Account Designation
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedRole("renter")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
              selectedRole === "renter"
                ? "bg-[#4E654C] border-[#4E654C] text-[#F4EFEA]"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            <UserCircle className="w-4 h-4" />
            <span className="text-xs font-bold">Renter Tenant</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("landlord")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
              selectedRole === "landlord"
                ? "bg-[#4E654C] border-[#4E654C] text-[#F4EFEA]"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-xs font-bold">Landlord</span>
          </button>
        </div>
      </div>

      {/* Dynamic Metadata Block */}
      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <textarea
            name="bio"
            rows={2}
            placeholder={
              selectedRole === "renter"
                ? "Introduce your clean rental habits or academic course details..."
                : "Briefly detail your rental listings and property portfolios..."
            }
            className="w-full bg-white text-[#1C1E1B] placeholder-zinc-400 rounded-xl p-3 border border-zinc-200 focus:border-[#4E654C] focus:outline-none text-sm resize-none shadow-sm"
          />
        </div>

        {selectedRole === "renter" && (
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase block">
              Lifestyle Habits
            </label>
            {habits.length > 0 && (
              <div className="flex flex-wrap gap-1 p-1.5 bg-white rounded-xl border border-zinc-200 shadow-sm">
                {habits.map((habit, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#4E654C]/10 border border-[#4E654C]/20 rounded-md text-[11px] font-semibold text-[#4E654C]"
                  >
                    {habit}
                    <button type="button" onClick={() => handleRemoveHabit(index)} className="hover:text-red-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Add dynamic habits (e.g. Non-smoker)"
                  className="w-full bg-white text-[#1C1E1B] placeholder-zinc-400 rounded-xl p-3 border border-zinc-200 focus:border-[#4E654C] focus:outline-none text-xs pr-12 shadow-sm"
                  value={habitInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setHabitInput(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddHabit(habitInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddHabit(habitInput)}
                  className="absolute right-2 p-1.5 bg-[#4E654C] text-white rounded-lg hover:bg-[#3d523b] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {filteredSuggestions.length > 0 && (
                <div className="absolute z-30 left-0 top-full w-full bg-white border border-zinc-200 max-h-32 overflow-y-auto rounded-xl mt-1 shadow-lg divide-y divide-zinc-50">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAddHabit(suggestion)}
                      className="w-full text-left px-3 py-2 text-xs text-zinc-600 hover:bg-[#4E654C] hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submission Action Callout */}
      <button
        type="submit"
        disabled={isLoading || isUploading}
        className="w-full bg-[#1C1E1B] text-[#F4EFEA] hover:bg-zinc-800 font-bold py-3.5 px-8 rounded-xl text-sm transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed text-center"
      >
        {isLoading ? "Sending Code..." : "Continue with Email OTP"}
      </button>
    </form>
  );
}