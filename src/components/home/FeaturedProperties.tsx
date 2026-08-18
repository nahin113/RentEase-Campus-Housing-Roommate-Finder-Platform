"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { publicFetch } from "@/lib/core/server"

interface Property {
  _id: string
  title: string
  desc: string
  location: string
  price: number
  images?: string[]
  image?: string
  status: "available" | "rented" | string
  amenities?: string[]
  createdAt?: string
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true)
        const response = await publicFetch("/api/rentposts/allposts")
        const fetchedData = response?.data || response || []
        if (Array.isArray(fetchedData)) {
          setProperties(fetchedData.slice(0, 4))
        }
      } catch (err) {
        console.error("Failed to load featured properties:", err)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  return (
    <section className="w-full px-6 md:px-16 py-16 bg-white">
      <div className="mb-10 text-left">
        <h2 className="text-4xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Latest Featured Properties
        </h2>
        <p className="text-xl text-gray-500 mt-1">
          Explore newly available student housing units near your campus.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => <PropertySkeletonCard key={idx} />)
          : properties.map((property) => {
              const displayImage =
                property.images && property.images.length > 0
                  ? property.images[0]
                  : property.image || "/placeholder.jpg"

              return (
                <div
                  key={property._id}
                  className="flex flex-col justify-between w-full h-[460px] bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-4 group hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[11/9] w-full rounded-xl overflow-hidden bg-gray-50">
                      <Image
                        src={displayImage}
                        alt={property.title}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      {property.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-50 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-gray-400 font-normal">Monthly Rent</span>
                      <div className="text-base font-extrabold text-gray-950">
                        ৳{property.price?.toLocaleString()}
                        <span className="text-xs font-normal text-gray-400">/mo</span>
                      </div>
                    </div>

                    {property.createdAt && (
                      <span className="text-[10px] text-gray-400 block">
                        Posted on: {new Date(property.createdAt).toLocaleDateString()}
                      </span>
                    )}

                    <Button
                      asChild
                      className="w-full h-9 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-all"
                    >
                      <Link href={`/rentposts/${property._id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              )
            })}
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
