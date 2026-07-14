"use client";

import React, { useState, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserCircle, Home, ArrowUpToLine, Plus, X } from "lucide-react";
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
  const [selectedRole, setSelectedRole] = useState<"student" | "landlord">("student");
  const [passwordError, setPasswordError] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Custom Habits States
  const [habits, setHabits] = useState<string[]>([]);
  const [habitInput, setHabitInput] = useState<string>("");

  // Simulated errors array structure matching your setup
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    if ((user.password as string).length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.signUp.email({
        email: user.email as string,
        password: user.password as string,
        name: user.name as string,
        image: logoUrl || undefined,
        accountType: selectedRole,
        bio: (user.bio as string) || undefined,
        ...(selectedRole === "student" && { habits }),
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created successfully!");
      if (onSuccess) onSuccess();
      router.refresh();
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic search matching suggestion row filtering
  const filteredSuggestions = habitInput.trim()
    ? SUGGESTED_HABITS.filter(
        (item) =>
          item.toLowerCase().includes(habitInput.toLowerCase()) &&
          !habits.includes(item)
      )
    : [];

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full text-left">
      
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
            onClick={() => setSelectedRole("student")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
              selectedRole === "student"
                ? "bg-[#4E654C] border-[#4E654C] text-[#F4EFEA]"
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            <UserCircle className="w-4 h-4" />
            <span className="text-xs font-bold">Student Tenant</span>
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
              selectedRole === "student"
                ? "Introduce your clean rental habits or academic course details..."
                : "Briefly detail your rental listings and property portfolios..."
            }
            className="w-full bg-white text-[#1C1E1B] placeholder-zinc-400 rounded-xl p-3 border border-zinc-200 focus:border-[#4E654C] focus:outline-none text-sm resize-none shadow-sm"
          />
        </div>

        {selectedRole === "student" && (
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
        {isLoading ? "Creating Account..." : "Sign Up"}
      </button>
    </form>
  );
}