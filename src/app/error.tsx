"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error)
  }, [error])

  return (
    <div className="min-h-[85vh] bg-gray-50/30 flex items-center justify-center px-6 py-20 font-sans">
      <div className="max-w-md w-full bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-sm text-center space-y-6">
        {/* Danger Icon Badge */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
          <AlertTriangle className="w-10 h-10" />
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-red-600 tracking-widest bg-red-50 px-3 py-1 rounded-full border border-red-100">
            System Alert
          </span>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight pt-2">
            Something went wrong!
          </h1>
          <p className="text-xs font-medium text-gray-500 leading-relaxed">
            We encountered an unexpected error while loading this page. Don't worry, your data is completely safe.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white font-extrabold text-xs rounded-2xl h-11 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl h-11 transition-all"
          >
            <Link href="/">
              <Home className="w-3.5 h-3.5 mr-1" /> Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}