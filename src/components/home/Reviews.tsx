"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Testimonial {
  id: number
  category: "Student Match" | "Landlord Partner" | "Roommate Co-Lease"
  title: string
  description: string
  smallImage: string
  largeImage: string
  rating: number
  author: {
    name: string
    role: string
    avatar: string
  }
}

// 1. RE-ALIGNED RENTEASE MOCK DATA
const REVIEWS_DATA: Testimonial[] = [
  {
    id: 1,
    category: "Roommate Co-Lease",
    title: "Matched with my ideal roommate and scored a budget-friendly flat!",
    description: "Finding accommodation was stressing me out until I used RentEase. I matched with Alexander based on our shared 'study-first' habits, merged our target budgets, and secured an amazing flat just 5 minutes from campus. Doing it together saved us thousands!",
    smallImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80", // Students studying together
    largeImage: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000&auto=format&fit=crop&q=80", // Warm bedroom setting
    rating: 5,
    author: {
      name: "Sarah Jenkins",
      role: "Sophomore Pre-Med Student",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    }
  },
  {
    id: 2,
    category: "Landlord Partner",
    title: "100% Occupancy with zero background-check headaches",
    description: "As a landlord, screening student tenants used to take weeks. RentEase provides verified student profiles, pre-assessed budgets, and incredibly smooth digital lease agreement templates. I filled all my four-bedroom suites in record time with reliable tenants.",
    smallImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&auto=format&fit=crop&q=80", // Modern property/key
    largeImage: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1000&auto=format&fit=crop&q=80", // Beautiful apartment interior
    rating: 5,
    author: {
      name: "Marcus Brody",
      role: "Jatinangor Property Owner",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
    }
  },
  {
    id: 3,
    category: "Student Match",
    title: "Transparent, simple, and exactly as advertised",
    description: "Living out of state made searching for housing incredibly risky. The verified property photos and video walkthroughs on RentEase matched reality perfectly. The messaging dashboard allowed me to directly secure the property with the landlord securely.",
    smallImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&auto=format&fit=crop&q=80", // Well-lit desk space
    largeImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80", // Modern collaborative room space
    rating: 5,
    author: {
      name: "Alex Rivera",
      role: "CS Junior, ITB",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    }
  }
]

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  // Autoplay loop (automatically slides every 8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 8000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS_DATA.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1))
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0
    })
  }

  const currentReview = REVIEWS_DATA[currentIndex]

  return (
    <section className="w-full px-6 md:px-16 py-20 bg-gray-50/40 font-sans overflow-hidden border-t border-b border-gray-100">
      
      {/* --- HEADER: Trust-building Intro --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f15a14]/10 rounded-full text-[#f15a14] text-[10px] font-bold tracking-wider uppercase">
            🌟 Loved by Students & Landlords
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-none uppercase">
            Proven Success <br/> On RentEase
          </h2>
        </div>

        <div className="lg:col-span-4 space-y-4 flex flex-col items-start lg:items-end text-left lg:text-right">
          <p className="text-xs md:text-sm text-gray-500 max-w-sm leading-relaxed">
            See how matching compatible roommates, simplifying rental applications, and guaranteeing listing transparency makes RentEase the perfect ecosystem.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="border-gray-200 hover:bg-white text-xs font-bold rounded-xl h-10" asChild>
              <a href="/properties">Browse Homes</a>
            </Button>
            <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white text-xs font-bold rounded-xl h-10 shadow-md shadow-orange-500/10">
              List Your Property
            </Button>
          </div>
        </div>
      </div>

      {/* --- ANIMATED CAROUSEL CONTAINER --- */}
      <div className="relative w-full min-h-[700px] lg:min-h-[500px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
          >
            {/* Left Content Card */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/30">
              <div className="space-y-6">
                
                {/* Category Badge & Stars */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wide bg-gray-100 text-gray-800 px-3 py-1 rounded-full uppercase">
                    ⚡ {currentReview.category}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: currentReview.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#f15a14] text-[#f15a14]" />
                    ))}
                  </div>
                </div>

                <div className="space-y-3 relative">
                  {/* Decorative quote icon */}
                  <Quote className="absolute -top-4 -left-2 w-10 h-10 text-gray-100 -z-0 pointer-events-none" />
                  
                  <h3 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight leading-snug relative z-10">
                    "{currentReview.title}"
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed relative z-10">
                    {currentReview.description}
                  </p>
                </div>

                {/* Micro Thumbnail Room Visualizer */}
                <div className="relative aspect-[16/9] w-full max-w-[240px] rounded-xl overflow-hidden shadow-inner border border-gray-50 hidden sm:block">
                  <Image 
                    src={currentReview.smallImage}
                    alt="Space preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Author & Controls */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4 mt-6">
                
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-200">
                    <AvatarImage src={currentReview.author.avatar} alt={currentReview.author.name} className="object-cover" />
                    <AvatarFallback className="font-bold bg-gray-100 text-gray-700">
                      {currentReview.author.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none">{currentReview.author.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{currentReview.author.role}</p>
                  </div>
                </div>

                {/* Left/Right Navigation Controllers */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handlePrev}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-8 h-8 rounded-full bg-gray-950 flex items-center justify-center text-white hover:bg-gray-800 active:scale-95 transition-all shadow-sm"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>

            {/* Right Showcase Photo Card */}
            <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-md min-h-[300px] lg:min-h-full">
              <Image 
                src={currentReview.largeImage}
                alt="Student apartment premium setup"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlaid Highlight Metric Box */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-2xl border border-gray-100 shadow-xl max-w-[240px]">
                <p className="text-[10px] font-bold text-[#f15a14] uppercase tracking-wider">RentEase Trust Score</p>
                <p className="text-lg font-black text-gray-950 mt-0.5">100% Verified</p>
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">Every listing is inspected and each user verified for your peace of mind.</p>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </section>
  )
}