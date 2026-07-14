"use client"

import React, { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Search, 
  Star, 
  Heart, 
  MapPin, 
  Check, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  GraduationCap
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Updated Types to support the Campus Neighbourhood filtering
export interface FlatProperty {
  id: string
  title: string
  location: string
  neighborhood: "jatinangor" | "itb-bandung" | "coblong"
  neighborhoodLabel: string
  price: number
  rating: number
  reviews: number
  image: string
  desc: string
  type: "Private Room" | "Entire Flat" | "Shared Co-Living"
}

// Structured Mock Data with explicit neighborhood definitions
const FLATS_DATA: FlatProperty[] = [
  {
    id: "flat-1",
    title: "Campus Edge Residences",
    location: "Jatinangor - 5 min walk to campus",
    neighborhood: "jatinangor",
    neighborhoodLabel: "Jatinangor Campus",
    price: 250,
    rating: 4.6,
    reviews: 73,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80",
    desc: "A verified student residence featuring modern private study areas and a cozy shared social lounge.",
    type: "Shared Co-Living"
  },
  {
    id: "flat-2",
    title: "Urban Nest Student Living",
    location: "Bandung - 8 min transit to Campus Area",
    neighborhood: "itb-bandung",
    neighborhoodLabel: "ITB / Bandung",
    price: 210,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop&q=80",
    desc: "Experience stress-free co-living with high-speed internet, premium appliances, and weekly cleanings.",
    type: "Private Room"
  },
  {
    id: "flat-3",
    title: "Greenfield Co-Living Suites",
    location: "Near ITB - 6 min walk from main gate",
    neighborhood: "itb-bandung",
    neighborhoodLabel: "ITB / Bandung",
    price: 195,
    rating: 4.9,
    reviews: 152,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=80",
    desc: "Premium shared layouts designed to support every aspect of your academic journey in an engaging community.",
    type: "Shared Co-Living"
  },
  {
    id: "flat-4",
    title: "Skyline Premium Studio",
    location: "Coblong - City Center near bus routes",
    neighborhood: "coblong",
    neighborhoodLabel: "Coblong / Center",
    price: 320,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop&q=80",
    desc: "High-end private studio unit featuring modular layouts, dedicated desk arrays, and sweeping city views.",
    type: "Entire Flat"
  }
]

export default function BrowseFlatsPage() {
  // --- UI STATES ---
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  // --- FILTER & SORT STATES ---
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("")
  const [maxBudget, setMaxBudget] = useState<number>(400)
  const [sortBy, setSortBy] = useState<string>("recommended")
  
  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState<number>(1)
  const totalPages = 3

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    setSaved(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // --- CLIENT-SIDE FILTERING & SORTING LOGIC ---
  const filteredFlats = useMemo(() => {
    return FLATS_DATA.filter((flat) => {
      const matchesSearch = searchQuery === "" || 
        flat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flat.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = selectedType === "" || flat.type === selectedType
      
      const matchesNeighborhood = selectedNeighborhood === "" || flat.neighborhood === selectedNeighborhood
      
      const matchesBudget = flat.price <= maxBudget

      return matchesSearch && matchesType && matchesNeighborhood && matchesBudget
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return 0 // Fallback to original order for "recommended" / "newest" in mock
    })
  }, [searchQuery, selectedType, selectedNeighborhood, maxBudget, sortBy])

  // --- INTEGRATION INTERFACES (API CAPABLE) ---
  const handleApplyFilters = () => {
    // TODO: Connect to backend query builder instead of client-side useMemo filters
    console.log("Submitting API Payload:", { 
      searchQuery, 
      selectedType, 
      selectedNeighborhood, 
      maxBudget, 
      sortBy, 
      currentPage 
    })
  }

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum)
    // TODO: Connect server payload pagination calls here
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-6 md:px-16 py-30 min-h-screen bg-white font-sans">
      
      {/* 1. Header Section */}
      <div className="mb-12 space-y-3">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 uppercase leading-none">
          Find Your Perfect <br /> Home Away From Home
        </h1>
        <p className="text-gray-500 text-sm max-w-2xl leading-relaxed pt-2">
          Transparent student-centric listings near premium universities. Filter by budget, lease layout, or campus neighborhood to match with safety verified rentals seamlessly.
        </p>
      </div>

      {/* 2. Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
        
        {/* Left Filter Sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-8 bg-gray-50/50 p-6 rounded-3xl border border-gray-100 lg:sticky lg:top-8">
          
          {/* Search Box */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
              Search Location
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="University, city, or district..." 
                className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f15a14] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* NEW: Campus Neighbourhood Filter Section */}
          <div className="border-t border-gray-200/60 pt-6 space-y-3">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#f15a14]" />
              <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
                Campus Neighbourhood
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "All Neighborhoods", value: "" },
                { name: "Jatinangor Area", value: "jatinangor" },
                { name: "ITB / Bandung", value: "itb-bandung" },
                { name: "Coblong", value: "coblong" }
              ].map((campus) => {
                const isActive = selectedNeighborhood === campus.value
                return (
                  <button
                    key={campus.name}
                    onClick={() => {
                      setSelectedNeighborhood(campus.value)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isActive 
                        ? "bg-gray-950 text-white border-transparent shadow-md" 
                        : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span>{campus.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Accommodation Type */}
          <div className="border-t border-gray-200/60 pt-6 space-y-3">
            <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
              Accommodation Type
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "All Layouts", value: "" },
                { name: "Private Room", value: "Private Room" },
                { name: "Shared Co-Living", value: "Shared Co-Living" },
                { name: "Entire Flat", value: "Entire Flat" }
              ].map((typeOption) => {
                const isActive = selectedType === typeOption.value
                return (
                  <button
                    key={typeOption.name}
                    onClick={() => {
                      setSelectedType(typeOption.value)
                      setCurrentPage(1)
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isActive 
                        ? "bg-[#f15a14] text-white border-transparent shadow-md shadow-orange-500/10" 
                        : "bg-white hover:bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    <span>{typeOption.name}</span>
                    {isActive && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Max Budget Range */}
          <div className="border-t border-gray-200/60 pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-gray-950 uppercase tracking-widest block">
                Max Monthly Budget
              </label>
              <span className="text-xs font-extrabold text-[#f15a14]">${maxBudget}/mo</span>
            </div>
            
            <input 
              type="range" 
              min="100" 
              max="600" 
              step="25"
              value={maxBudget}
              onChange={(e) => {
                setMaxBudget(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="w-full accent-[#f15a14]"
            />
            
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>$100/MO</span>
              <span>$600/MO</span>
            </div>
          </div>

          {/* Apply Filters Trigger (Backend Hook) */}
          <Button 
            onClick={handleApplyFilters}
            className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl py-6 text-xs font-bold shadow-md shadow-orange-500/5 transition-all active:scale-[0.98]"
          >
            Apply Active Filters
          </Button>
        </div>

        {/* Right Listings Container */}
        <div className="flex-1 space-y-8">
          
          {/* Sorting & Result Counts Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {filteredFlats.length} verified listings found
            </span>
            
            {/* Sorting Trigger */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-gray-400 font-semibold">Sort By:</span>
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-9 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#f15a14] transition-all cursor-pointer"
                >
                  <option value="recommended">Recommended Matches</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredFlats.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <p className="text-gray-400 text-sm font-semibold">No flats match your selected filters.</p>
              <Button 
                onClick={() => {
                  setSelectedNeighborhood("")
                  setSelectedType("")
                  setMaxBudget(400)
                  setSearchQuery("")
                }}
                variant="outline"
                className="rounded-xl text-xs font-bold border-gray-200 hover:bg-gray-50"
              >
                Reset All Filters
              </Button>
            </div>
          )}

          {/* Main Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredFlats.map((flat) => (
              <Link 
                key={flat.id} 
                href={`/flats/${flat.id}`}
                className="group flex flex-col gap-3 cursor-pointer"
              >
                {/* Image Frame with Save Overlay */}
                <div className="relative h-60 w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100/50">
                  <Image 
                    src={flat.image} 
                    alt={flat.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  />
                  
                  {/* Save Button */}
                  <button 
                    onClick={(e) => toggleSave(flat.id, e)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-gray-800 hover:text-red-500 hover:scale-105 active:scale-95 transition-all shadow-md z-10"
                  >
                    <Heart className={`w-4 h-4 transition-all ${saved[flat.id] ? "fill-current text-red-500 scale-110" : ""}`} />
                  </button>

                  {/* Accommodation Tag Pill */}
                  <span className="absolute top-4 left-4 bg-gray-950/85 backdrop-blur-md text-white text-[9px] font-bold py-1 px-2.5 rounded-lg shadow-sm uppercase tracking-wider">
                    {flat.type}
                  </span>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent p-4 pt-12">
                    <p className="text-white text-xs font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#f15a14]" />
                      {flat.location}
                    </p>
                  </div>
                </div>

                {/* Listing Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {flat.neighborhoodLabel}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug group-hover:text-[#f15a14] transition-colors line-clamp-1">
                    {flat.title}
                  </h3>

                  {/* Price & Star Ratings Row */}
                  <div className="flex items-center justify-between">
                    <div className="text-gray-950 font-black text-base flex items-baseline gap-0.5">
                      <span className="text-xs font-normal text-gray-400">$</span>
                      {flat.price} 
                      <span className="text-[10px] font-semibold text-gray-400 ml-1">/ mo</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-950">
                      <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> 
                      <span>{flat.rating}</span> 
                      <span className="font-medium text-gray-400">({flat.reviews})</span>
                    </div>
                  </div>

                  {/* Card Micro description */}
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {flat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Buttons */}
          {filteredFlats.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-12 border-t border-gray-100">
              <button 
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
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
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                      isActive 
                        ? "bg-gray-950 text-white border-transparent shadow-md shadow-gray-900/10" 
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
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-700 bg-white hover:bg-gray-50 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-sm"
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