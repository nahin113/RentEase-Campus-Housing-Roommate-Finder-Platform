import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/30 py-20 font-sans">
      <div className="container mx-auto px-6 md:px-16 pt-8 pb-4">
        <Skeleton className="h-4 w-36 bg-gray-200/60 rounded-md mb-8" />
        
        {/* Main Loading Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            {/* Header skeleton */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3 w-2/3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20 bg-gray-200/60 rounded-md" />
                    <Skeleton className="h-5 w-32 bg-gray-200/60 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-full bg-gray-200/60 rounded-xl" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200/60 rounded-md" />
                </div>
                <Skeleton className="h-16 w-32 bg-gray-200/60 rounded-2xl" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-gray-100 rounded-2xl" />
                ))}
              </div>
            </div>

            {/* Main visual skeleton */}
            <Skeleton className="aspect-[16/9] w-full rounded-3xl bg-gray-200/60 shadow-sm" />

            {/* Info cards skeleton */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
              <Skeleton className="h-4 w-40 bg-gray-200/60 rounded-md" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-gray-100 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-150 rounded-3xl p-6 space-y-4 shadow-sm">
              <Skeleton className="h-6 w-1/3 bg-gray-200/60 rounded-md" />
              <Skeleton className="h-12 w-full bg-[#f15a14]/20 rounded-2xl" />
              <Skeleton className="h-12 w-full bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}