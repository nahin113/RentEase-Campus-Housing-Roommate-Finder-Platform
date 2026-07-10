"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

// Mock data for the feature grid to keep the component clean
const FEATURES_DATA = [
  {
    id: 1,
    title: "Purpose-Built Study Environments",
    description: "Dedicated study zones and quiet workspaces are integrated into each residence, creating a...",
  },
  {
    id: 2,
    title: "Verified & Secure Living",
    description: "Every listing is carefully reviewed and verified to ensure a safe, reliable, and trustworthy livin...",
  },
  {
    id: 3,
    title: "Transparent Pricing",
    description: "This way, students can manage their budgets with assurance. Transparent rental agreemen...",
  },
  {
    id: 4,
    title: "Flexible & Student-Centric Options",
    description: "Choose from private rooms, shared kitchen, or studio units — all strategically located near ca...",
  }
]

export default function FeatureSection() {
  return (
    <section className="w-full px-6 md:px-16 py-16 bg-white font-sans">
      
      {/* 1. TOP IMAGE BANNER */}
      <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden mb-16">
        <Image 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80" // Replace with your actual image path
          alt="Modern study environment"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* 2. MIDDLE STATS & HEADING ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end mb-20">
        
        {/* Left: Main Heading */}
        <div className="max-w-md">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 leading-[1.1] tracking-tight">
            Designed to Support <br className="hidden md:block" /> Every Aspect of Student <br className="hidden md:block" /> Living.
          </h2>
        </div>

        {/* Right: Massive Number Stat */}
        <div className="flex flex-col md:items-end text-left md:text-right">
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-[100px] font-normal text-gray-900 tracking-tighter leading-none mb-2">
            2,345,678
          </div>
          <div className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-wider">
            12,500+ STUDENTS SUCCESSFULLY HOUSED
          </div>
        </div>

      </div>

      {/* 3. BOTTOM FEATURES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {FEATURES_DATA.map((feature) => (
          <div key={feature.id} className="flex flex-col group">
            
            {/* Custom Toggle/Star Icon */}
            <div className="mb-6">
              <div className="w-12 h-6 bg-gray-200 rounded-full relative flex items-center shadow-inner">
                {/* Orange Circle overlapping the right edge slightly */}
                <div className="absolute -right-2 w-7 h-7 bg-[#f15a14] rounded-full shadow-md flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Feature Text */}
            <h4 className="text-sm font-semibold text-gray-900 mb-3 tracking-tight">
              {feature.title}
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-3">
              {feature.description}
            </p>

            {/* Learn More Link */}
            <Link 
              href="#" 
              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors mt-auto w-fit"
            >
              Learn More
            </Link>
            
          </div>
        ))}
      </div>

    </section>
  )
}