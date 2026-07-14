"use client"

import { useEffect, useRef, } from 'react'
import Image from 'next/image'
import { motion, useInView, animate } from 'framer-motion'
import { Building2, Users, Handshake, Sparkles } from 'lucide-react'

// --- CUSTOM HOOK FOR COUNTING ANIMATION ---
function AnimatedCounter({ from = 0, to, duration = 2.5 }: { from?: number, to: number, duration?: number }) {
  const nodeRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(nodeRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            // Format with commas
            nodeRef.current.textContent = Math.round(value).toLocaleString('en-US')
          }
        }
      })
      return () => controls.stop()
    }
  }, [from, to, duration, inView])

  return <span ref={nodeRef}>{from}</span>
}

// --- MOCK DATA FOR PLATFORM STATS ---
const STATS_DATA = [
  {
    id: 1,
    icon: Building2,
    value: 3450,
    suffix: "+",
    label: "Properties Listed",
    description: "Verified student apartments, co-living spaces, and private rooms available near campuses."
  },
  {
    id: 2,
    icon: Users,
    value: 12800,
    suffix: "+",
    label: "Active Students",
    description: "Verified university students actively searching for housing and compatible roommates."
  },
  {
    id: 3,
    icon: Handshake,
    value: 8420,
    suffix: "+",
    label: "Successful Matches",
    description: "Total number of signed leases and successful roommate pairings facilitated by RentEase."
  }
]

export default function PlatformStatistics() {
  return (
    <section className="relative w-full px-6 md:px-16 py-20 bg-gray-950 font-sans overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#f15a14_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* --- TOP HEADER ROW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-16 lg:mb-24">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[#f15a14] text-[10px] font-bold tracking-wider uppercase border border-white/5">
              <Sparkles className="w-3 h-3" />
              Trusted Ecosystem
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-tight tracking-tight">
              The Numbers Behind <br className="hidden md:block" /> 
              <span className="text-[#f15a14] font-bold">RentEase.</span>
            </h2>
          </div>
          
          <div className="text-left lg:text-right flex flex-col justify-end h-full">
            <p className="text-sm text-gray-400 leading-relaxed max-w-md ml-auto">
              We've built a secure, transparent, and highly efficient network bridging the gap between property owners and university students looking for their perfect home.
            </p>
          </div>
        </div>

        {/* --- STATS GRID & IMAGE ROW --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Image Showcase (Spans 5 cols) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80" 
              alt="Happy students matching on RentEase"
              fill
              className="object-cover"
            />
            {/* Overlay Gradient for readability if you want to add text over image later */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-sm font-medium leading-snug">
                "Finding a place and a roommate was seamless. RentEase changed the way we approach off-campus living."
              </p>
            </div>
          </motion.div>

          {/* Right: The Stats Grid (Spans 7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {STATS_DATA.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
                  className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#f15a14]/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-[#f15a14]" />
                  </div>
                  
                  {/* Animated Number */}
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 flex items-baseline">
                    <AnimatedCounter to={stat.value} />
                    <span className="text-[#f15a14] ml-1">{stat.suffix}</span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-gray-200 mb-2 tracking-wide uppercase">
                    {stat.label}
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {stat.description}
                  </p>
                </motion.div>
              )
            })}

            {/* 4th filler card to balance the 2x2 grid elegantly */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
              className="flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#f15a14] to-[#d6480a] rounded-2xl p-6 md:p-8 shadow-lg shadow-orange-500/20"
            >
              <h4 className="text-xl font-bold text-white mb-3 leading-snug">
                Ready to find your match?
              </h4>
              <button className="bg-white text-gray-950 hover:bg-gray-50 text-xs font-bold py-3 px-6 rounded-xl transition-transform active:scale-95 shadow-sm">
                Join RentEase Today
              </button>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  )
}