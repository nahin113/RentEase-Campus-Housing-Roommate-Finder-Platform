"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface RenterRoommate {
  _id: string
  name: string
  email: string
  image: string
  role: "renter"
  lifestyle_habits: string[]
  budget: number
  bio: string
  createdAt: string
}

const DUMMY_RENTERS: RenterRoommate[] = [
  {
    _id: "renter_001",
    name: "Sarah Jenkins",
    email: "sarah@university.edu",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    role: "renter",
    lifestyle_habits: ["Early Bird", "No Smoking", "Study-First"],
    budget: 200,
    bio: "Sophomore Pre-Med major. Looking for a quiet, organized living space near campus libraries.",
    createdAt: new Date().toISOString()
  },
  {
    _id: "renter_002",
    name: "Alex Rivera",
    email: "alex.r@university.edu",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    role: "renter",
    lifestyle_habits: ["Night Owl", "Pet Friendly", "Vegan"],
    budget: 180,
    bio: "Computer Science junior. Looking to share an apartment with flatmates open to cooking together.",
    createdAt: new Date().toISOString()
  },
  {
    _id: "renter_003",
    name: "Chloe Chen",
    email: "cchen@university.edu",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    role: "renter",
    lifestyle_habits: ["Clean Freak", "Gym Enthusiast", "Quiet"],
    budget: 240,
    bio: "Senior Business Renter. I value keeping communal spaces immaculate and organized.",
    createdAt: new Date().toISOString()
  },
  {
    _id: "renter_004",
    name: "Marcus Brody",
    email: "marcus@university.edu",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    role: "renter",
    lifestyle_habits: ["Musician", "Social", "Gamer"],
    budget: 190,
    bio: "Freshman Design Renter looking for roommates interested in co-leasing a multi-bedroom house.",
    createdAt: new Date().toISOString()
  }
]

export default function FeaturedStudents() {
  const [renters, setRenters] = useState<RenterRoommate[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setRenters(DUMMY_RENTERS)
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="w-full px-6 md:px-16 py-16 bg-gray-50/50 border-t border-gray-100">
      <div className="mb-10 text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Featured Renters (Roommate Finder)
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Connect with peers looking for shared spaces near campus based on your lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => <RenterSkeletonCard key={idx} />)
          : renters.map((renter) => (
              <div 
                key={renter._id} 
                className="flex flex-col justify-between w-full h-[380px] bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="space-y-4 text-center flex flex-col items-center">
                  <Avatar className="h-16 w-16 border border-gray-100 shadow-inner">
                    <AvatarImage src={renter.image} alt={renter.name} className="object-cover" />
                    <AvatarFallback className="font-bold bg-gray-100 text-gray-700">
                      {renter.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 tracking-tight block max-w-[180px] truncate">
                      {renter.name}
                    </h3>
                    <div className="inline-block bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Target Budget: ${renter.budget}/mo
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 px-1">
                    "{renter.bio}"
                  </p>
                </div>

                <div className="space-y-4 pt-3 border-t border-gray-50">
                  <div className="flex flex-wrap gap-1 justify-center max-h-[52px] overflow-hidden">
                    {renter.lifestyle_habits.slice(0, 3).map((tag, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button asChild variant="outline" className="w-full h-8 border-gray-200 hover:bg-gray-50 text-xs font-semibold rounded-xl">
                    <Link href={`/roommates/${renter._id}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </section>
  )
}

function RenterSkeletonCard() {
  return (
    <div className="flex flex-col justify-between w-full h-[380px] bg-white border border-gray-100 rounded-2xl p-5 items-center">
      <div className="space-y-4 w-full flex flex-col items-center">
        <Skeleton className="h-16 w-16 rounded-full bg-gray-100" />
        <div className="space-y-2 w-full flex flex-col items-center">
          <Skeleton className="h-4 w-1/2 bg-gray-100" />
          <Skeleton className="h-3 w-1/3 rounded-full bg-gray-100" />
        </div>
        <Skeleton className="h-8 w-5/6 bg-gray-100" />
      </div>
      <div className="space-y-3 w-full mt-4 pt-3">
        <div className="flex gap-1 justify-center">
          <Skeleton className="h-4 w-12 bg-gray-100" />
          <Skeleton className="h-4 w-14 bg-gray-100" />
          <Skeleton className="h-4 w-12 bg-gray-100" />
        </div>
        <Skeleton className="h-8 w-full rounded-xl bg-gray-100" />
      </div>
    </div>
  )
}