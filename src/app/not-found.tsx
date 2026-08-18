import Link from "next/link"
import { Building2, Search, ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-[85vh] bg-gray-50/30 flex items-center justify-center px-6 py-20 font-sans">
      <div className="max-w-md w-full bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-sm text-center space-y-6">
        {/* Icon Header */}
        <div className="relative w-20 h-20 mx-auto rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f15a14]">
          <Building2 className="w-10 h-10" />
          <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-[#f15a14] tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-100 inline-block">
            Error 404
          </span>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight pt-2">
            Property Not Found
          </h1>
          <p className="text-xs font-medium text-gray-500 leading-relaxed">
            The flat or page you are looking for might have been unlisted, moved, or never existed in RentEase.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
          <Link
            href="/flats"
            className={buttonVariants({
              className: "w-full sm:flex-1 bg-[#f15a14] hover:bg-[#d6480a] text-white font-extrabold text-xs rounded-2xl h-11 transition-all justify-center"
            })}
          >
            Browse Available Flats
          </Link>

          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              className: "w-full sm:flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-2xl h-11 transition-all justify-center gap-1.5"
            })}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}