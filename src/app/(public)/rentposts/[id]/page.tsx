"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { 
  MapPin, 
  BedDouble, 
  ShowerHead, 
  Car, 
  Maximize, 
  Calendar, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PropertyPostCard, FlatProperty } from "@/components/shared/PropertyPostCard"
import { publicFetch } from "@/lib/core/server"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

// Dynamically import map component to avoid SSR window is not defined error
const LeafletMap = dynamic(() => import("@/components/shared/Map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-gray-50 rounded-3xl animate-pulse flex items-center justify-center border border-gray-150">
      <span className="text-xs font-bold text-gray-400">Loading map elements...</span>
    </div>
  )
})

interface InsightData {
  neighborhood: string
  priceTrends: Array<{ year: string; price: number; growth: number }>
  yieldVacancy: Array<{ year: string; yield: number; vacancy: number }>
  bedroomsDistribution: Array<{ name: string; count: number }>
  demographics: Array<{ name: string; value: number }>
}

export default function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  const [flat, setFlat] = useState<FlatProperty | null>(null)
  const [similarFlats, setSimilarFlats] = useState<FlatProperty[]>([])
  const [insights, setInsights] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const [descExpanded, setDescExpanded] = useState(false)

  useEffect(() => {
    async function loadDetails() {
      try {
        setLoading(true)
        const [flatRes, similarRes, insightsRes] = await Promise.all([
          publicFetch(`/api/rentposts/rentpost/${id}`),
          publicFetch(`/api/rentposts/similar/${id}`),
          publicFetch(`/api/rentposts/insights/${id}`)
        ])

        const flatData = flatRes?.data || flatRes
        if (flatData) {
          setFlat(flatData)
        } else {
          setError("Listing not found")
        }

        const similarData = similarRes?.data || similarRes || []
        if (Array.isArray(similarData)) {
          setSimilarFlats(similarData)
        }

        const insightsData = insightsRes?.data || insightsRes
        if (insightsData) {
          setInsights(insightsData)
        }
      } catch (err) {
        console.error("Failed to load details page data", err)
        setError("Error loading property listing details.")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadDetails()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-6 md:px-16 py-12 space-y-8 animate-pulse font-sans">
        <Skeleton className="h-8 w-1/4 bg-gray-100 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] w-full bg-gray-100 rounded-3xl" />
            <Skeleton className="h-6 w-1/2 bg-gray-100 rounded-md" />
            <Skeleton className="h-24 w-full bg-gray-100 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full bg-gray-100 rounded-3xl" />
            <Skeleton className="h-48 w-full bg-gray-100 rounded-3xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !flat) {
    return (
      <div className="container mx-auto px-6 py-20 text-center space-y-4 font-sans">
        <h2 className="text-xl font-bold text-gray-900">{error || "Property not found"}</h2>
        <Link href="/flats" className="inline-flex items-center gap-2 text-xs font-bold text-[#f15a14] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>
      </div>
    )
  }

  const images = flat.images && flat.images.length > 0 ? flat.images : [flat.image]
  const landlord = flat.landlord || {
    name: "Verified Host",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badge: "Superhost",
    timestamp: flat.createdAt
      ? new Date(flat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "Just now"
  }

  // Handle image slider navigation
  const handlePrevImg = () => {
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNextImg = () => {
    setCurrentImgIdx((prev) => (prev + 1) % images.length)
  }

  // Colors for Demographics Donut Chart
  const DONUT_COLORS = ["#f15a14", "#3b82f6", "#6b7280"]

  return (
    <div className="min-h-screen bg-gray-50/30 py-20 font-sans">
      {/* Top Banner Navigation */}
      <div className="container mx-auto px-6 md:px-16 pt-8 pb-4">
        <Link href="/flats" className="inline-flex items-center gap-2 text-xs font-extrabold text-gray-500 hover:text-gray-950 transition-colors uppercase tracking-wider">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Rent Spaces
        </Link>
      </div>

      <div className="container mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header section */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black bg-gray-100 text-[#f15a14] px-2 py-1 rounded-md uppercase tracking-wider">
                    {flat.type}
                  </span>
                  {flat.targetAudience === "bachelor" && (
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Suitable for: Bachelor Only
                    </span>
                  )}
                  {flat.targetAudience === "family" && (
                    <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Suitable for: Family Only
                    </span>
                  )}
                  {flat.targetAudience === "both" && (
                    <span className="text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      Suitable for: Bachelor & Family
                    </span>
                  )}
                </div>
                <h1 className="text-xl md:text-3xl font-black text-gray-950 tracking-tight leading-tight">
                  {flat.title || `Available ${flat.type} near ${flat.neighborhoodLabel || flat.neighborhood}`}
                </h1>
                <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold pt-1">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{flat.location}</span>
                </div>
              </div>
              <div className="bg-[#f15a14]/5 border border-[#f15a14]/10 rounded-2xl p-4 text-right flex flex-col items-end justify-center min-w-[140px]">
                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider leading-none mb-1">Monthly Rent</span>
                <span className="text-xl md:text-2xl font-black text-[#f15a14]">৳{flat.price.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span></span>
                <span className="text-[9px] font-bold bg-[#f15a14]/10 text-[#f15a14] px-2 py-0.5 rounded-full mt-1.5 whitespace-nowrap">
                  {flat.serviceCharge && flat.serviceCharge > 0 
                    ? `+ ৳${flat.serviceCharge.toLocaleString()} Service Charge` 
                    : "Service Charge Included"}
                </span>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
              {flat.type === "Entire Flat" ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Beds</span>
                      <span className="text-xs font-black text-gray-950">{flat.roomDetails?.bedrooms || 1} Bedrooms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <ShowerHead className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Baths</span>
                      <span className="text-xs font-black text-gray-950">{flat.roomDetails?.bathrooms || 1} Bathrooms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <Maximize className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Balconies</span>
                      <span className="text-xs font-black text-gray-950">{flat.roomDetails?.balconies || 0} Balconies</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Dining Space</span>
                      <span className="text-xs font-black text-gray-950">{flat.roomDetails?.hasDiningSpace ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <Maximize className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Room Size</span>
                      <span className="text-xs font-black text-gray-950">{flat.roomSpecs?.roomSizeSqFt ? `${flat.roomSpecs.roomSizeSqFt} sqft` : "N/A"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <ShowerHead className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Bathroom</span>
                      <span className="text-xs font-black text-gray-950 capitalize">{flat.roomSpecs?.bathroomType || "Attached"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Bed Type</span>
                      <span className="text-xs font-black text-gray-950 capitalize">{flat.roomSpecs?.bedType || "Single"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100">
                    <div className="p-2 rounded-xl bg-white border border-gray-200/60 text-[#f15a14]">
                      <Car className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase block leading-none mb-0.5">Parking</span>
                      <span className="text-xs font-black text-gray-950">Yes</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hero Image Slider / Gallery */}
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-gray-150 bg-gray-100 shadow-sm group">
            <Image 
              src={images[currentImgIdx]} 
              alt={flat.title} 
              fill 
              className="object-cover transition-all duration-500" 
              priority
            />
            {images.length > 1 && (
              <>
                <button onClick={handlePrevImg} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-950 p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10 hover:scale-105 active:scale-95">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={handleNextImg} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-950 p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10 hover:scale-105 active:scale-95">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-gray-950/70 backdrop-blur-md px-3.5 py-1.5 rounded-full z-10">
                  {images.map((_, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setCurrentImgIdx(idx)} 
                      className={`h-2 rounded-full transition-all ${idx === currentImgIdx ? "w-5 bg-[#f15a14]" : "w-2 bg-white/50"}`} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentImgIdx(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${idx === currentImgIdx ? "border-[#f15a14] scale-95 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"}`}
                >
                  <Image src={img} alt={`thumbnail-${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Investment & Quick Metrics Grid */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase text-gray-950 tracking-wider">Quick Location & Yield Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-1">Median Price</span>
                <span className="text-base font-black text-gray-950">৳{flat.price.toLocaleString()}</span>
              </div>
              <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-1">Weekly Rent</span>
                <span className="text-base font-black text-gray-950">৳{Math.round(flat.price / 4).toLocaleString()}</span>
              </div>
              <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-1">Potential Yield</span>
                <span className="text-base font-black text-emerald-600">6.8% Gross</span>
              </div>
              <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-1">Vacancy Rate</span>
                <span className="text-base font-black text-[#f15a14]">2.5% Low</span>
              </div>
              <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-1">Days Listed</span>
                <span className="text-base font-black text-gray-950">12 Days</span>
              </div>
              <div className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-1">Valuation Range</span>
                <span className="text-xs font-bold text-gray-700">৳{(flat.price - 3000).toLocaleString()} - ৳{(flat.price + 5000).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* House Rules & Logistics Section */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase text-gray-950 tracking-wider">House Rules & Logistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-[#f15a14] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-0.5">Occupancy Limits</span>
                  <span className="text-xs font-black text-gray-950">
                    {flat.occupancyLimits?.minPerson || 1} - {flat.occupancyLimits?.maxPerson || 4} Persons
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-[#f15a14] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-0.5">Gate Curfew</span>
                  <span className="text-xs font-black text-gray-950">
                    Closes at {flat.gateClosingTime || "11:00 PM"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-[#f15a14] shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-0.5">Flat Condition</span>
                  <span className="text-xs font-black text-gray-950 capitalize">
                    {(flat.condition || "well_maintained").replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-100 text-[#f15a14] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 block uppercase tracking-wider mb-0.5">Preference</span>
                  <span className="text-xs font-black text-gray-950 capitalize">
                    {flat.targetAudience === "both" ? "Bachelor & Family" : `${flat.targetAudience} Only`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description details */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-gray-950 tracking-wider">About This Property</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {flat.desc}
            </p>
            {descExpanded && flat.fullDescription && (
              <p className="text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-100 whitespace-pre-line">
                {flat.fullDescription}
              </p>
            )}
            {flat.fullDescription && (
              <button 
                onClick={() => setDescExpanded(!descExpanded)}
                className="text-xs font-bold text-[#f15a14] hover:text-[#d6480a] flex items-center gap-1 pt-2 transition-colors"
              >
                {descExpanded ? (
                  <>Show Less <ChevronUp className="w-4 h-4" /></>
                ) : (
                  <>Read More Description <ChevronDown className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>

          {/* Amenities details */}
          {flat.amenities && flat.amenities.length > 0 && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase text-gray-950 tracking-wider">Amenities & Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {flat.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f15a14]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive OpenStreetMap View */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-gray-950 tracking-wider">Neighborhood Map View</h3>
              <div className="flex gap-2">
                <button className="text-[10px] font-black uppercase border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-gray-600">Street view</button>
                <button className="text-[10px] font-black uppercase border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-gray-600">Directions</button>
              </div>
            </div>
            <LeafletMap location={flat.location} neighborhood={flat.neighborhood} />
          </div>

          {/* Market Insights with Recharts */}
          {insights && (
            <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase text-gray-950 tracking-wider">Neighborhood Analytics & Market Insights</h3>
                <p className="text-xs text-gray-400 font-semibold">Real-time local statistics and analysis for {insights.neighborhood}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Median Price & Growth */}
                <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/20">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Median Price & Growth</span>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={insights.priceTrends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Line type="monotone" dataKey="price" stroke="#f15a14" strokeWidth={3} dot={{ fill: "#f15a14" }} name="Median Rent (৳)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Gross Yield vs Vacancy */}
                <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/20">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Gross Yield & Vacancy Rate</span>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={insights.yieldVacancy}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Area type="monotone" dataKey="yield" stackId="1" stroke="#f15a14" fill="#f15a14" fillOpacity={0.1} name="Yield %" />
                        <Area type="monotone" dataKey="vacancy" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Vacancy %" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Bedrooms Distribution */}
                <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/20">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Bedrooms Layout Availability</span>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={insights.bedroomsDistribution}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                        <Bar dataKey="count" fill="#f15a14" radius={[4, 4, 0, 0]} name="Units" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Demographics (Pie Chart) */}
                <div className="space-y-2 border border-gray-100 rounded-2xl p-4 bg-gray-50/20">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Demographics Age Split</span>
                  <div className="h-48 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={insights.demographics}
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {insights.demographics.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 text-[10px] font-extrabold text-gray-600">
                    {insights.demographics.map((item, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                        <span>{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8 lg:sticky lg:top-8">
          
          {/* Agent Information Card */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-150 bg-gray-50">
                <Image src={landlord.avatar} alt={landlord.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-950 tracking-tight">{landlord.name}</h4>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{landlord.badge} • Premium Partner</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+880 1712 345678</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-600 font-semibold">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>partner@rentease.com</span>
              </div>
            </div>

            <Button className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl py-6 text-xs font-bold shadow-md shadow-orange-500/5 transition-all">
              Contact Agent & View Listing
            </Button>
          </div>

          {/* Inspection times card */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase text-gray-950 tracking-wider">Scheduled Inspections</h4>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#f15a14] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-black text-gray-950 block">Saturday, August 15</span>
                <span className="text-[10px] font-bold text-gray-500 block">10:00 AM - 11:30 AM</span>
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-xl py-5 border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700">
              Add to Calendar
            </Button>
          </div>

          {/* Rent Box / Sticky Applying actions */}
          <div className="bg-white border border-[#f15a14]/20 rounded-3xl p-6 shadow-md shadow-orange-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#f15a14] text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-2xl">
              Hot Space
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wider mb-1">Standard Bond Fee</span>
                <span className="text-sm font-black text-gray-950">৳{(flat.price * 2).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 block uppercase tracking-wider mb-1">Minimum Stay</span>
                <span className="text-sm font-black text-gray-950">6 Months contract</span>
              </div>
              <Button className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl py-6 text-xs font-extrabold tracking-wide shadow-md shadow-orange-500/5 transition-all">
                Apply for Rent
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Suggested Similars posts */}
      {similarFlats.length > 0 && (
        <div className="container mx-auto px-6 md:px-16 pt-16 border-t border-gray-150 mt-16 space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-950 uppercase tracking-tight">Similar Properties in this Neighborhood</h3>
            <p className="text-xs text-gray-400 font-semibold">Other properties you might be interested in near {flat.neighborhoodLabel || flat.neighborhood}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarFlats.map((sFlat) => (
              <PropertyPostCard key={sFlat._id} flat={sFlat} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
