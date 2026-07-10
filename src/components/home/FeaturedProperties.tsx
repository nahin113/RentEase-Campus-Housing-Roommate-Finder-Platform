"use client"

import { useState, useEffect } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface Property {
  _id: string
  title: string
  short_description: string
  location: string
  rent_amount: number
  images: string[]
  landlord_email: string
  status: "available" | "rented"
  amenities: string[]
  createdAt: string
}

// DUMMY DATA FOR HOUSING SECTIONS (Change/Delete when connecting to MongoDB)
const DUMMY_PROPERTIES: Property[] = [
  {
    _id: "prop_001",
    title: "Premium Quad Living Suite",
    short_description: "A fully furnished premium student flat located just a short 5-minute walk to the main campus gates.",
    location: "Jatinangor - 5 min walk to uni",
    rent_amount: 185,
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600"],
    landlord_email: "landlord1@test.com",
    status: "available",
    amenities: ["Wifi", "Laundry", "AC"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "prop_002",
    title: "Urban Nest Loft Space",
    short_description: "Modern open-concept housing perfect for focus groups. Features high-speed fiber internet infrastructure.",
    location: "Bandung - 8 min to Campus Area",
    rent_amount: 210,
    images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600"],
    landlord_email: "owner2@test.com",
    status: "available",
    amenities: ["Kitchen", "Gym Access"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "prop_003",
    title: "Greenfield Shared Flat",
    short_description: "Cozy private room in a shared student house. Includes weekly cleaning utilities and shared lounge access.",
    location: "Near ITB - 6 min walk",
    rent_amount: 195,
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600"],
    landlord_email: "mgmt@greenfield.com",
    status: "available",
    amenities: ["Parking", "Cleaning Service"],
    createdAt: new Date().toISOString()
  },
  {
    _id: "prop_004",
    title: "Campus Edge Residences",
    short_description: "High-tier student accommodation with individual ensuite bathrooms, dynamic study bays, and biometric gates.",
    location: "Jatinangor - 5 min walk to uni",
    rent_amount: 250,
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600"],
    landlord_email: "admin@campusedge.co",
    status: "rented",
    amenities: ["24/7 Security", "Private Bath"],
    createdAt: new Date().toISOString()
  }
]

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulated API latency to demonstrate the custom skeleton screens
    const timer = setTimeout(() => {
      setProperties(DUMMY_PROPERTIES)
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full px-6 md:px-16 py-16 bg-white">
      <div className="mb-10 text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Latest Featured Properties
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore newly available student housing units near your campus.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => <PropertySkeletonCard key={idx} />)
          : properties.map((property) => (
              <div 
                key={property._id} 
                className="flex flex-col justify-between w-full h-[460px] bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-4 group hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[11/9] w-full rounded-xl overflow-hidden bg-gray-50">
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold py-1 px-2.5 rounded-md shadow-sm uppercase tracking-wider">
                      {property.status}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-gray-400 block truncate">
                      📍 {property.location}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight truncate">
                      {property.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {property.short_description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-50 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-gray-400 font-normal">Monthly Rent</span>
                    <div className="text-base font-extrabold text-gray-950">
                      ${property.rent_amount}<span className="text-xs font-normal text-gray-400">/mo</span>
                    </div>
                  </div>
                  
                  <span className="text-[10px] text-gray-400 block">
                    Posted on: {new Date(property.createdAt).toLocaleDateString()}
                  </span>

                  <Button asChild className="w-full h-9 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-all">
                    <Link href={`/properties/${property._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}

function PropertySkeletonCard() {
  return (
    <div className="flex flex-col justify-between w-full h-[460px] bg-white border border-gray-100 rounded-2xl p-4">
      <div className="space-y-3">
        <Skeleton className="aspect-[11/9] w-full rounded-xl bg-gray-100" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-1/3 bg-gray-100" />
          <Skeleton className="h-4 w-3/4 bg-gray-100" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full bg-gray-100" />
          <Skeleton className="h-3 w-5/6 bg-gray-100" />
        </div>
      </div>
      <div className="space-y-3 pt-3">
        <Skeleton className="h-4 w-full bg-gray-100" />
        <Skeleton className="h-8 w-full rounded-xl bg-gray-100" />
      </div>
    </div>
  )
}