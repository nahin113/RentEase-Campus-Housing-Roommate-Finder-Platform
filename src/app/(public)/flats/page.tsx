"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Search, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Users,
  Check,
  RotateCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PropertyPostCard } from "@/components/shared/PropertyPostCard"
import { publicFetch } from "@/lib/core/server"

export interface FlatProperty {
  _id: string
  id?: string
  title: string
  desc: string
  fullDescription?: string
  price: number
  location: string
  neighborhood: string
  neighborhoodLabel?: string
  type: "Private Room" | "Entire Flat" | "Shared Co-Living" | string
  targetAudience: "bachelor" | "family" | string
  amenities?: string[]
  image: string
  images?: string[]
  status: "available" | "rented" | string
  landlordId?: string
  landlord?: {
    name: string
    avatar: string
    badge?: string
    timestamp: string
  }
  createdAt?: string
  updatedAt?: string
  __v?: number
}

export default function BrowseFlatsPage() {
  const [flatsData, setFlatsData] = useState<FlatProperty[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("")
  const [selectedTargetAudience, setSelectedTargetAudience] = useState<string>("") 
  const [maxBudget, setMaxBudget] = useState<number>(50000) 
  const [sortBy, setSortBy] = useState<string>("newest")

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 6

  useEffect(() => {
    async function loadFlats() {
      try {
        setLoading(true)
        const response = await publicFetch("/api/rentposts/allposts")
        const fetchedData = response?.data || response || []
        if (Array.isArray(fetchedData)) {
          setFlatsData(fetchedData)
        }
      } catch (err) {
        console.error("Failed to load rent posts:", err)
      } finally {
        setLoading(false)
      }
    }
    loadFlats()
  }, [])

  // Dynamic Neighborhood options derived directly from MongoDB records
  const availableNeighborhoods = useMemo(() => {
    const list = flatsData
      .map((f) => f.neighborhood)
      .filter((n): n is string => Boolean(n))
    return Array.from(new Set(list))
  }, [flatsData])

  // Filtering & Sorting Logic
  const filteredFlats = useMemo(() => {
    return flatsData
      .filter((flat) => {
        const query = searchQuery.toLowerCase().trim()
        const matchesSearch =
          query === "" ||
          flat.title?.toLowerCase().includes(query) ||
          flat.desc?.toLowerCase().includes(query) ||
          flat.location?.toLowerCase().includes(query) ||
          flat.type?.toLowerCase().includes(query) ||
          flat.neighborhood?.toLowerCase().includes(query) ||
          flat.amenities?.some((a) => a.toLowerCase().includes(query))

        const matchesType = selectedType === "" || flat.type === selectedType
        const matchesNeighborhood =
          selectedNeighborhood === "" || flat.neighborhood === selectedNeighborhood
        const matchesTargetAudience =
          selectedTargetAudience === "" || flat.targetAudience === selectedTargetAudience
        const matchesBudget = flat.price <= maxBudget

        return (
          matchesSearch &&
          matchesType &&
          matchesNeighborhood &&
          matchesTargetAudience &&
          matchesBudget
        )
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price
        if (sortBy === "price-high") return b.price - a.price
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        }
        return 0
      })
  }, [flatsData, searchQuery, selectedType, selectedNeighborhood, selectedTargetAudience, maxBudget, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredFlats.length / itemsPerPage) || 1
  const paginatedFlats = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredFlats.slice(start, start + itemsPerPage)
  }, [filteredFlats, currentPage])

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedType("")
    setSelectedNeighborhood("")
    setSelectedTargetAudience("")
    setMaxBudget(30000)
    setSortBy("newest")
    setCurrentPage(1)
  }

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-6 md:px-16 py-30 min-h-screen bg-white font-sans">
      {/* 1. Header Section */}
      <div className="mb-10 space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-950 uppercase leading-tight">
          Find Your Perfect <br /> Rent Space
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
          Transparent student & family rentals. Filter by budget, room style, tenant preference, or neighborhood to secure your place seamlessly.
        </p>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Filter Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-7 bg-gray-50/60 p-6 rounded-3xl border border-gray-100 lg:sticky lg:top-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-gray-900 tracking-wider">Filters</span>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-gray-400 hover:text-[#f15a14] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Title, area, or amenities..."
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f15a14] transition-all"
              />
            </div>
          </div>

          {/* Tenant Target Audience */}
          <div className="border-t border-gray-200/60 pt-5 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#f15a14]" />
              <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
                Tenant Preference
              </label>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { name: "All Tenants", value: "" },
                { name: "Bachelor / Student", value: "bachelor" },
                { name: "Family Friendly", value: "family" },
              ].map((aud) => {
                const isActive = selectedTargetAudience === aud.value
                return (
                  <button
                    key={aud.name}
                    onClick={() => {
                      setSelectedTargetAudience(aud.value)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-[#f15a14] text-white border-transparent shadow-sm"
                        : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span>{aud.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Neighborhood Filter (Dynamic) */}
          <div className="border-t border-gray-200/60 pt-5 space-y-2.5">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#f15a14]" />
              <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
                Neighborhood
              </label>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => {
                  setSelectedNeighborhood("")
                  setCurrentPage(1)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedNeighborhood === ""
                    ? "bg-gray-950 text-white border-transparent"
                    : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                <span>All Neighborhoods</span>
                {selectedNeighborhood === "" && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {availableNeighborhoods.map((nh) => {
                const isActive = selectedNeighborhood === nh
                return (
                  <button
                    key={nh}
                    onClick={() => {
                      setSelectedNeighborhood(nh)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-gray-950 text-white border-transparent"
                        : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span className="truncate">{nh}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Room Type */}
          <div className="border-t border-gray-200/60 pt-5 space-y-2.5">
            <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
              Accommodation Type
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {[
                { name: "All Types", value: "" },
                { name: "Private Room", value: "Private Room" },
                { name: "Shared Co-Living", value: "Shared Co-Living" },
                { name: "Entire Flat", value: "Entire Flat" },
              ].map((t) => {
                const isActive = selectedType === t.value
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      setSelectedType(t.value)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-gray-950 text-white border-transparent"
                        : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span>{t.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Max Budget Range (BDT) */}
          <div className="border-t border-gray-200/60 pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
                Max Monthly Rent
              </label>
              <span className="text-xs font-extrabold text-[#f15a14]">
                ৳{maxBudget.toLocaleString()}/mo
              </span>
            </div>
            <input
              type="range"
              min="3000"
              max="30000"
              step="1000"
              value={maxBudget}
              onChange={(e) => {
                setMaxBudget(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="w-full accent-[#f15a14] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>৳3,000</span>
              <span>৳30,000+</span>
            </div>
          </div>
        </div>

        {/* Right Listings Container */}
        <div className="flex-1 space-y-6 w-full">
          {/* Top Bar: Counts & Sorting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {filteredFlats.length} Properties Available
            </span>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-gray-400 font-semibold">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f15a14] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-3xl p-4 space-y-3 bg-white">
                  <Skeleton className="h-48 w-full rounded-2xl bg-gray-100" />
                  <Skeleton className="h-5 w-3/4 bg-gray-100" />
                  <Skeleton className="h-4 w-1/2 bg-gray-100" />
                  <Skeleton className="h-10 w-full rounded-xl bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredFlats.length === 0 && (
            <div className="py-20 text-center space-y-3 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm font-semibold">No listings match your current filters.</p>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="rounded-xl text-xs font-bold border-gray-200 hover:bg-gray-100"
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* Rent Post Cards Grid */}
          {!loading && filteredFlats.length > 0 && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {paginatedFlats.map((flat) => (
                <PropertyPostCard key={flat._id} flat={flat} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-100">
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1
                const isActive = pageNum === currentPage
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                      isActive
                        ? "bg-gray-950 text-white border-transparent"
                        : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}