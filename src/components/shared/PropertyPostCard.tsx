"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Heart, 
  MapPin, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  BadgeCheck
} from "lucide-react"

// Consistent types matching your data layer
// Inside: src/components/shared/PropertyPostCard.tsx

export interface FlatProperty {
  id: string
  location: string
  neighborhood: "Rupnagar Abashik" | "itb-bandung" | "coblong" | "all-city" // Update this line
  neighborhoodLabel: string
  price: number
  rating: number
  reviews: number
  image: string
  desc: string 
  type: "Private Room" | "Entire Flat" | "Shared Co-Living"
  targetAudience: "bachelor" | "family" 
  landlord?: {
    name: string
    avatar: string
    badge?: string
    timestamp: string
  }
}

interface PropertyPostCardProps {
  flat: FlatProperty
}

export function PropertyPostCard({ flat }: PropertyPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Default fallback details if landlord data isn't fully supplied by database yet
  const landlord = flat.landlord || {
    name: "Verified Premium Host",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    badge: "Superhost",
    timestamp: "Just now"
  }

  // AUTOMATED HEADLINE GENERATOR (Replaces manual title input)
  const generatedStatusHeadline = `Available ${flat.type} configured for ${flat.targetAudience}s near ${flat.neighborhoodLabel}`

  return (
    <article className="w-full bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 font-sans">
      
      {/* 1. Post Header: Landlord Identity */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-150">
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
              <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider scale-90">
                {flat.targetAudience}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">{landlord.timestamp} • Posted from {flat.neighborhoodLabel}</p>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-900 p-1.5 rounded-full hover:bg-gray-50 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Main Post Copy (The Automated Status Header + Landlord Description) */}
      <div className="px-5 pb-4 space-y-2">
        <p className="text-xs font-extrabold text-gray-950 leading-snug tracking-tight">
          {generatedStatusHeadline}
        </p>
        <p className="text-xs text-gray-600 leading-relaxed font-normal">
          {flat.desc}
        </p>
      </div>

      {/* 3. Social Media Style Image Box */}
      <Link href={`/flats/${flat.id}`} className="block relative aspect-[4/3] w-full bg-gray-50 overflow-hidden cursor-pointer group">
        <Image 
          src={flat.image} 
          alt="Property layout update" 
          fill 
          className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          sizes="(max-w-768px) 100vw, 50vw"
        />
        
        {/* Modern Price Floating Overlay Badge */}
        <div className="absolute bottom-4 left-4 bg-gray-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg text-white">
          <span className="text-[9px] block text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">Rent Rate</span>
          <span className="text-sm font-black">${flat.price}<span className="text-[10px] font-normal text-gray-400">/mo</span></span>
        </div>

        {/* Dynamic Location Overlay Tag */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm text-gray-900 text-[10px] font-bold">
          <MapPin className="w-3 h-3 text-[#f15a14] fill-[#f15a14]/10" />
          <span>{flat.location}</span>
        </div>
      </Link>

      {/* 4. Social Action Toolbar (Like, Comment, Save) */}
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
            <span>{flat.reviews + (isLiked ? 1 : 0)}</span>
          </button>

          <Link 
            href={`/flats/${flat.id}#comments`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Landlord</span>
          </Link>

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