"use client"

import React from 'react'
import Image from 'next/image'
import { Search, Users, CalendarCheck } from 'lucide-react'

// Strong typing for step indicators
interface Step {
  id: number
  icon: React.ComponentType<any>
  title: string
  description: string
}

const STEPS_DATA: Step[] = [
  {
    id: 1,
    icon: Search,
    title: "1. Find Your Pathway",
    description: "Browse verified local student properties directly, or start by exploring our Student Community if you need a compatible roommate first."
  },
  {
    id: 2,
    icon: Users,
    title: "2. Connect & Match",
    description: "Found a peer with matching lifestyle habits? Match profiles, team up on RentEase, and easily merge your target budgets to co-lease together."
  },
  {
    id: 3,
    icon: CalendarCheck,
    title: "3. Secure Your Space",
    description: "Submit your application together or solo. Book securely through our protected system and receive immediate landlord approval."
  }
]

export default function HowItWorks() {
  return (
    // Outer Wrapper with a subtle background image peaking through the padding
    <section className="relative w-full p-4 md:p-8 lg:p-12 bg-gray-50 overflow-hidden font-sans">
      
      {/* Background overlay details */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image 
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1600&auto=format&fit=crop&q=80"
          alt="Room background grid"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Main White Card Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto bg-white rounded-3xl shadow-xl px-6 py-16 md:px-12 lg:px-16 lg:py-20 border border-gray-100/50">
        
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-[#f15a14] uppercase mb-4">
            How RentEase Works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Match Roommates, Find Housing, All in One Place
          </h2>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            Whether you already have a group or are starting entirely from scratch, RentEase guides you from matching to moving in.
          </p>
        </div>

        {/* --- ASYMMETRICAL GRID SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT SIDE: (Spans 8 columns) Contains Top Images and Bottom Steps */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            
            {/* Top Row: Two Landscape Images representing both lifestyles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 lg:mb-16">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm group">
                <Image 
                  src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80" 
                  alt="Verified premium housing interiors" 
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-103"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold py-1 px-2.5 rounded-md shadow-sm uppercase tracking-wide">
                  Step A: Browse Housing
                </div>
              </div>
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm group">
                <Image 
                  src="https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600&auto=format&fit=crop&q=80" 
                  alt="Students studying together" 
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-103"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 text-[10px] font-bold py-1 px-2.5 rounded-md shadow-sm uppercase tracking-wide">
                  Step B: Find Roommates
                </div>
              </div>
            </div>

            {/* Bottom Row: Three Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {STEPS_DATA.map((step) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.id} className="flex flex-col text-left">
                    {/* Orange Icon Circle */}
                    <div className="w-9 h-9 rounded-full bg-[#f15a14] flex items-center justify-center mb-5 shadow-md shadow-orange-500/20">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    {/* Text Content */}
                    <h4 className="text-sm font-bold text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT SIDE: (Spans 4 columns) Contains One Tall Portrait Image of modern student lifestyle */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="relative w-full h-[400px] lg:h-full rounded-2xl overflow-hidden shadow-sm group">
              <Image 
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80" 
                alt="Bright collaborative student house layout" 
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-103"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md text-gray-900 text-[11px] font-semibold py-3 px-4 rounded-xl text-center border border-gray-100 shadow-lg">
                💡 Tip: Find a roommate first to share costs!
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}