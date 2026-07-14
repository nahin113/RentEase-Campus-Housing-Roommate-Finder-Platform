"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, DollarSign, Users, ArrowUpRight, Compass } from 'lucide-react'

// Mock Data representing Universities & their respective popular neighborhoods
const UNIVERSITIES_DATA = [
  {
    id: "univ-1",
    name: "State University",
    shorthand: "State U",
    neighborhoods: [
      {
        id: "n-1",
        name: "University Hill",
        image: "https://images.unsplash.com/photo-1541448989048-f567c61cfcd7?w=600&auto=format&fit=crop&q=80",
        distance: "3 mins walk to North Gate",
        avgRent: "$620",
        activeMatches: 24,
        propertiesCount: 142,
        tag: "Most Popular"
      },
      {
        id: "n-2",
        name: "Westside Commons",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
        distance: "8 mins shuttle ride",
        avgRent: "$510",
        activeMatches: 18,
        propertiesCount: 89,
        tag: "Best Value"
      },
      {
        id: "n-3",
        name: "Downtown Arts District",
        image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=600&auto=format&fit=crop&q=80",
        distance: "12 mins transit",
        avgRent: "$780",
        activeMatches: 15,
        propertiesCount: 64,
        tag: "Social Hub"
      },
      {
        id: "n-4",
        name: "Northside Gardens",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
        distance: "5 mins bike ride",
        avgRent: "$580",
        activeMatches: 11,
        propertiesCount: 55,
        tag: "Quiet Zone"
      }
    ]
  },
  {
    id: "univ-2",
    name: "City Tech Institute",
    shorthand: "City Tech",
    neighborhoods: [
      {
        id: "n-5",
        name: "Metro Center",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
        distance: "Adjacent to Campus",
        avgRent: "$850",
        activeMatches: 31,
        propertiesCount: 112,
        tag: "Urban Living"
      },
      {
        id: "n-6",
        name: "East River Canal",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
        distance: "10 mins walk",
        avgRent: "$690",
        activeMatches: 22,
        propertiesCount: 78,
        tag: "Scenic Views"
      },
      {
        id: "n-7",
        name: "Innovation Quarter",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
        distance: "7 mins transit",
        avgRent: "$750",
        activeMatches: 19,
        propertiesCount: 93,
        tag: "Tech Hub"
      },
      {
        id: "n-8",
        name: "Greenwood Suburbs",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
        distance: "20 mins express bus",
        avgRent: "$490",
        activeMatches: 8,
        propertiesCount: 42,
        tag: "Spacious"
      }
    ]
  },
  {
    id: "univ-3",
    name: "Greenvalley College",
    shorthand: "Greenvalley",
    neighborhoods: [
      {
        id: "n-9",
        name: "Cottage Meadows",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80",
        distance: "4 mins bike ride",
        avgRent: "$450",
        activeMatches: 14,
        propertiesCount: 49,
        tag: "Cozy & Quiet"
      },
      {
        id: "n-10",
        name: "Valley Square Plaza",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=80",
        distance: "2 mins walk",
        avgRent: "$590",
        activeMatches: 27,
        propertiesCount: 81,
        tag: "Super Central"
      },
      {
        id: "n-11",
        name: "Forest Hills",
        image: "https://images.unsplash.com/photo-1448630360428-65474ff4e614?w=600&auto=format&fit=crop&q=80",
        distance: "15 mins walk",
        avgRent: "$420",
        activeMatches: 9,
        propertiesCount: 38,
        tag: "Nature Friendly"
      },
      {
        id: "n-12",
        name: "The Ridge Loop",
        image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&auto=format&fit=crop&q=80",
        distance: "8 mins shuttle ride",
        avgRent: "$480",
        activeMatches: 12,
        propertiesCount: 51,
        tag: "Active Student Life"
      }
    ]
  }
]

export default function CampusNeighborhoods() {
  const [selectedUnivId, setSelectedUnivId] = useState(UNIVERSITIES_DATA[0].id)

  const activeUniversity = UNIVERSITIES_DATA.find(u => u.id === selectedUnivId) || UNIVERSITIES_DATA[0]

  return (
    <section className="w-full px-6 md:px-16 py-24 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER: Micro Badge & Headline --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f15a14]/10 rounded-full text-[#f15a14] text-[10px] font-bold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5" />
              Explore By Campus Area
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-none uppercase">
              Popular Campus <br className="hidden md:block"/> Neighborhoods
            </h2>
          </div>
          <p className="text-xs md:text-sm text-gray-500 max-w-sm leading-relaxed">
            Quickly filter verified student housing options and match-ready roommate squads directly by their proximity to your college campus gates.
          </p>
        </div>

{/* --- INTERACTIVE UNIVERSITY FILTER TABS --- */}
<div className="flex flex-wrap gap-2 md:gap-3 border-b border-gray-100 pb-6 mb-12">
  {UNIVERSITIES_DATA.map((univ) => {
    const isActive = univ.id === selectedUnivId
    return (
      <button
        key={univ.id}
        onClick={() => setSelectedUnivId(univ.id)}
        className={`relative px-5 py-3 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 overflow-hidden ${
          isActive 
            ? "text-white" 
            : "text-gray-600 bg-gray-50 hover:bg-gray-100 border border-transparent"
        }`}
      >
        {/* Layer for active solid orange background smoothly transitioning */}
        {isActive && (
          <motion.div 
            layoutId="activeTabBg"
            className="absolute inset-0 bg-[#f15a14] rounded-xl shadow-lg shadow-orange-500/10"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        {/* We wrap the text in a relative container with z-10 so it sits on top of the orange background */}
        <span className="relative z-10">{univ.name}</span>
      </button>
    )
  })}
</div>

        {/* --- NEIGHBORHOODS CARDS STAGGERED GRID --- */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {activeUniversity.neighborhoods.map((neighborhood, index) => (
              <motion.div
                key={neighborhood.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
                className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:border-orange-500/20 transition-all duration-300"
              >
                {/* 1. Card Media Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                  <Image 
                    src={neighborhood.image}
                    alt={neighborhood.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Accent Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-gray-900 text-[10px] font-bold py-1 px-2.5 rounded-lg shadow-sm tracking-wide uppercase">
                    🏠 {neighborhood.tag}
                  </div>
                </div>

                {/* 2. Card Content Box */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div className="space-y-4">
                    {/* Neighborhood Title */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug group-hover:text-[#f15a14] transition-colors">
                        {neighborhood.name}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-800 group-hover:bg-[#f15a14] group-hover:text-white transition-all duration-300 flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Proximity Details */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Navigation className="w-3.5 h-3.5 text-[#f15a14] flex-shrink-0" />
                      <span>{neighborhood.distance}</span>
                    </div>

                    {/* Neighborhood Stats Row */}
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
                      
                      {/* Average Rent */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Avg. Rent</span>
                        <div className="flex items-center text-xs font-extrabold text-gray-950">
                          <DollarSign className="w-3.5 h-3.5 text-[#f15a14] -mr-0.5" />
                          <span>{neighborhood.avgRent}</span>
                          <span className="text-[10px] font-normal text-gray-400 ml-0.5">/mo</span>
                        </div>
                      </div>

                      {/* Active Co-Leases/Matches */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Matchmaking</span>
                        <div className="flex items-center gap-1 text-xs font-extrabold text-gray-950">
                          <Users className="w-3.5 h-3.5 text-blue-500" />
                          <span>{neighborhood.activeMatches} Pairs</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 3. Action Call / Availability Indicator */}
                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-semibold">
                      {neighborhood.propertiesCount} properties listed
                    </span>
                    <span className="text-[#f15a14] font-bold group-hover:underline cursor-pointer flex items-center gap-1">
                      View Properties
                    </span>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  )
}