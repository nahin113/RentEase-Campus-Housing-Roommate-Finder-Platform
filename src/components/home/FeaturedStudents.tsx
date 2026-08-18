"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserSession } from "@/lib/core/session"
import { publicFetch } from "@/lib/core/server"

interface LifestyleHabits {
  cleanliness?: string
  sleepSchedule?: string
  guestPolicy?: string
  diet?: string
  smoking?: string
  [key: string]: string | undefined
}

interface Roommate {
  _id: string
  name: string
  email: string
  image?: string
  bio?: string
  university?: string
  department?: string
  academicYear?: string
  roomType?: string
  budgetRange?: {
    min: number
    max: number
  }
  habits?: string[]
  lifestyleHabits?: LifestyleHabits
  matchScore?: number
  profileCompleted?: boolean
  createdAt?: string
}

export default function FeaturedStudents() {
  const [loading, setLoading] = useState<boolean>(true)
  const [roommates, setRoommates] = useState<Roommate[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getUserSession()
        const res = await publicFetch(`/api/roommates/${user?.id}`)
        const data = res?.data || res
        
        if (Array.isArray(data)) {
          const featuredata = data.filter((roommate: Roommate) => roommate.matchScore !== undefined).sort((a: Roommate, b: Roommate) => (b.matchScore || 0) - (a.matchScore || 0));
          setRoommates(featuredata.slice(0, 4))
        }
      } catch (err) {
        console.error("Failed to load roommates", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Helper to extract display tags from both habits array & lifestyle object
  const getDisplayTags = (roommate: Roommate): string[] => {
    const tags: string[] = []
    
    if (roommate.habits && Array.isArray(roommate.habits)) {
      tags.push(...roommate.habits)
    }

    if (roommate.lifestyleHabits) {
      const { cleanliness, sleepSchedule, diet, smoking } = roommate.lifestyleHabits
      if (cleanliness) tags.push(cleanliness)
      if (sleepSchedule) tags.push(sleepSchedule)
      if (diet) tags.push(diet)
      if (smoking) tags.push(smoking)
    }

    // Deduplicate and return top 3
    return Array.from(new Set(tags)).slice(0, 3)
  }

  return (
    <section className="w-full px-6 md:px-16 py-16 bg-gray-50/50 border-t border-gray-100">
      <div className="mb-10 text-left">
        <h2 className="text-4xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Featured Renters (Roommate Finder)
        </h2>
        <p className="text-xl text-gray-500 mt-1">
          Connect with peers looking for shared spaces near campus based on your lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => <RenterSkeletonCard key={idx} />)
        ) : roommates.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 text-sm">
            No roommates found at this moment.
          </div>
        ) : (
          roommates.map((roommate) => {
            const tags = getDisplayTags(roommate)
            const minBudget = roommate.budgetRange?.min?.toLocaleString() || "N/A"
            const maxBudget = roommate.budgetRange?.max?.toLocaleString() || "N/A"

            return (
              <div
                key={roommate._id}
                className="relative flex flex-col justify-between w-full h-[400px] bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                {/* Match Score Badge */}
                {typeof roommate.matchScore === "number" && (
                  <div className="absolute top-4 right-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    {roommate.matchScore}% Match
                  </div>
                )}

                <div className="space-y-3 text-center flex flex-col items-center">
                  <Avatar className="h-16 w-16 border border-gray-100 shadow-inner">
                    <AvatarImage
                      src={roommate.image}
                      alt={roommate.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="font-bold bg-gray-100 text-gray-700">
                      {roommate.name ? roommate.name.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 w-full">
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight truncate px-2">
                      {roommate.name || "Anonymous"}
                    </h3>

                    {/* Academic info */}
                    {(roommate.university || roommate.department) && (
                      <p className="text-[11px] text-gray-500 font-medium truncate">
                        {roommate.university} {roommate.department ? `• ${roommate.department}` : ""}
                      </p>
                    )}

                    {/* Budget Range */}
                    <div className="inline-block bg-emerald-50/80 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1">
                      Budget: ৳{minBudget} - ৳{maxBudget}/mo
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 px-1 min-h-[32px]">
                    {roommate.bio ? `"${roommate.bio}"` : "No bio provided."}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  {/* Habit Tags */}
                  <div className="flex flex-wrap gap-1 justify-center min-h-[26px]">
                    {tags.length > 0 ? (
                      tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200/40 truncate max-w-[100px]"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-gray-400">No habits listed</span>
                    )}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-9 border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-xl"
                  >
                    <Link href={`/roommates/${roommate._id}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}

function RenterSkeletonCard() {
  return (
    <div className="flex flex-col justify-between w-full h-[400px] bg-white border border-gray-100 rounded-2xl p-5 items-center">
      <div className="space-y-4 w-full flex flex-col items-center">
        <Skeleton className="h-16 w-16 rounded-full bg-gray-100" />
        <div className="space-y-2 w-full flex flex-col items-center">
          <Skeleton className="h-4 w-1/2 bg-gray-100" />
          <Skeleton className="h-3 w-1/3 rounded-full bg-gray-100" />
          <Skeleton className="h-4 w-2/3 rounded-full bg-gray-100" />
        </div>
        <Skeleton className="h-8 w-5/6 bg-gray-100" />
      </div>
      <div className="space-y-3 w-full mt-4 pt-3">
        <div className="flex gap-1 justify-center">
          <Skeleton className="h-4 w-12 bg-gray-100" />
          <Skeleton className="h-4 w-14 bg-gray-100" />
          <Skeleton className="h-4 w-12 bg-gray-100" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl bg-gray-100" />
      </div>
    </div>
  )
}