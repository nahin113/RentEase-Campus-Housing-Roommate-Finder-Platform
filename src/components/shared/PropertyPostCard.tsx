"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Heart, 
  MapPin, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { publicFetch } from "@/lib/core/server"

export interface FlatProperty {
  _id: string
  id?: string
  title: string
  desc: string
  fullDescription?: string
  price: number
  serviceCharge?: number
  roomDetails?: {
    bedrooms: number
    bathrooms: number
    balconies: number
    kitchens: number
    hasDiningSpace: boolean
  }
  occupancyLimits?: {
    minPerson: number
    maxPerson: number
  }
  condition?: "brand_new" | "recently_renovated" | "well_maintained" | "old" | string
  gateClosingTime?: string
  roomSpecs?: {
    roomSizeSqFt?: number
    bathroomType?: "attached" | "shared" | string
    bedType?: "single" | "double" | "bunk" | "unfurnished" | string
  }
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
}

interface PropertyPostCardProps {
  flat: FlatProperty
}

export function PropertyPostCard({ flat }: PropertyPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [currentImageIdx, setCurrentImageIdx] = useState(0)
  const [user, setUser] = useState({name: "", image: "", accountType: ""})

  useEffect(() => {
    const landlordDetails = async ()=> {
      try{
        const userData = await publicFetch(`/api/users/${flat.landlordId}`);
        setUser(userData.data);
      } catch(err) {
        console.log(err);
      }
    }
    landlordDetails();
  }, []);

  // Use MongoDB _id as the primary identifier key
  const postId = flat._id || flat.id
  console.log(user)

  // Images handling (supports array of images or single fallback image)
  const displayImages = flat.images && flat.images.length > 0 ? flat.images : [flat.image]

  // Default fallback details if landlord data isn't fully supplied by the API



  const landlord = flat.landlord || {
    name: user?.name || "Verified Host",
    avatar: user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badge: user?.accountType || "Superhost",
    timestamp: flat.createdAt
      ? new Date(flat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "Just now"
  }

  // Dynamic status headline fallback if title isn't provided
  const statusHeadline = flat.title || `Available ${flat.type} for ${flat.targetAudience}s near ${flat.neighborhoodLabel || flat.neighborhood}`

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIdx((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  return (
    <article className="w-full bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 font-sans flex flex-col justify-between">
      
      <div>
        {/* 1. Post Header: Landlord Identity */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-150 bg-gray-100 shrink-0">
              <Image 
                src={landlord.avatar} 
                alt={landlord.name} 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-gray-950 tracking-tight">{landlord.name}</h4>
                <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500 shrink-0" />
                {flat.targetAudience === "bachelor" && (
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider scale-90">
                    Bachelor Only
                  </span>
                )}
                {flat.targetAudience === "family" && (
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider scale-90">
                    Family Only
                  </span>
                )}
                {flat.targetAudience === "both" && (
                  <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-100 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider scale-90">
                    Bachelor & Family
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-medium">
                {landlord.timestamp} • Posted from {flat.neighborhoodLabel || flat.neighborhood}
              </p>
            </div>
          </div>
          
          <button className="text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-50 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Main Post Copy */}
        <div className="px-5 pb-4 space-y-2">
          <h3 className="text-xs font-extrabold text-gray-950 leading-snug tracking-tight">
            {statusHeadline}
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed font-normal line-clamp-2">
            {flat.desc}
          </p>

          {/* Amenities Pills */}
          {flat.amenities && flat.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {flat.amenities.slice(0, 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold bg-gray-50 border border-gray-200/60 text-gray-600 px-2 py-0.5 rounded-lg flex items-center gap-1"
                >
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> {amenity}
                </span>
              ))}
              {flat.amenities.length > 3 && (
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
                  +{flat.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* 3. Social Media Style Image Box */}
        <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden group">
          <Link href={`/rentposts/${postId}`} className="block relative w-full h-full">
            <Image 
              src={displayImages[currentImageIdx] || "/placeholder.jpg"} 
              alt={flat.title || "Property Listing"} 
              fill 
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Link>
          
          {/* Multi-image Controls */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full z-10">
                {displayImages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentImageIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Price Overlay Badge (Bangladeshi Taka ৳) */}
          <div className="absolute bottom-4 left-4 bg-gray-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg text-white pointer-events-none">
            <span className="text-[9px] block text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Rent Rate</span>
            <span className="text-sm font-black">৳{flat.price?.toLocaleString()}<span className="text-[10px] font-normal text-gray-400">/mo</span></span>
          </div>

          {/* Dynamic Location Overlay Tag */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm text-gray-900 text-[10px] font-bold pointer-events-none">
            <MapPin className="w-3 h-3 text-[#f15a14] fill-[#f15a14]/10" />
            <span className="truncate max-w-[150px]">{flat.location}</span>
          </div>
        </div>
      </div>

      {/* 4. Social Action Toolbar (Like, Comment, Info, Save) */}
      <div className="p-4 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isLiked 
                ? "text-red-500 bg-red-50" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Heart className={`w-4 h-4 transition-transform ${isLiked ? "fill-current scale-110" : ""}`} />
            <span>{isLiked ? 1 : 0}</span>
          </button>

          <Link 
            href={`/rentposts/${postId}#comments`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Landlord</span>
          </Link>

          {/* Detailed Info Modal */}
          {flat.fullDescription && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all">
                  <Info className="w-4 h-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 font-sans">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold text-gray-950">{flat.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-[#f15a14]" />
                    <span>{flat.location}</span>
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-line leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    {flat.fullDescription}
                  </div>
                  {flat.amenities && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-gray-900 block">Amenities</span>
                      <div className="flex flex-wrap gap-1.5">
                        {flat.amenities.map((a, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-700">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          <button className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <button 
          onClick={() => setIsSaved(!isSaved)}
          className={`p-2 rounded-xl transition-all ${
            isSaved ? "text-[#f15a14] bg-orange-50" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

    </article>
  )
}