"use client"

import Image from "next/image"
import { Shield, Eye, HeartHandshake, CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 md:px-16 py-30 bg-white font-sans text-gray-900">
      
      {/* 1. Brand Manifesto Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f15a14]/10 rounded-full text-[#f15a14] text-[10px] font-bold tracking-wider uppercase">
            The RentEase Standard
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 uppercase leading-none">
            Empowering <br /> Student Renters.
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            RentEase was engineered to solve a structural breakdown in off-campus housing. For years, students relocated to new cities only to face unverified listings, unsafe deposit practices, and unreliable flat conditions. 
          </p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
            We replaced guesswork with absolute verification. By aligning secure deposit escrows with hands-on on-site inspections, we protect your wallet, your peace of mind, and your academic journey.
          </p>
          
          <div className="flex items-center gap-6 pt-4">
            <div>
              <p className="text-3xl font-black text-[#f15a14]">100%</p>
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">On-Site Inspected</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-3xl font-black text-gray-950">15k+</p>
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Students Shielded</p>
            </div>
          </div>
        </div>
        
        {/* Editorial Visual Hero */}
        <div className="relative h-[520px] w-full rounded-3xl overflow-hidden shadow-xl shadow-orange-500/5 border border-gray-100">
          <Image 
            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80" 
            alt="Modern verified student space"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 2. Operational Methodology (How We Work) */}
      <div className="py-20 border-t border-gray-100 space-y-16">
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] font-black text-[#f15a14] tracking-widest uppercase">The rent protection cycle</span>
          <h2 className="text-3xl font-black uppercase text-gray-950">How RentEase Guards Your Lease</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Unlike classic search directories, RentEase serves as an active protocol between landlord promises and tenant expectations. We don't just host list pages; we inspect, secure, and intermediate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4 p-8 rounded-3xl bg-gray-50 border border-gray-100/50">
            <div className="w-12 h-12 rounded-2xl bg-[#f15a14]/10 flex items-center justify-center text-[#f15a14]">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-950">1. Physical Inspections</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every single listing on RentEase is vetted by a field officer. We verify layout integrity, utility performance, structural locks, and check walking distances to campus gates.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-gray-50 border border-gray-100/50">
            <div className="w-12 h-12 rounded-2xl bg-gray-950/10 flex items-center justify-center text-gray-950">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-950">2. Secure Escrow Holding</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your security deposit is never transferred directly to the owner upon booking. We hold it in a verified trust account, only releasing it after you check in and confirm the unit matches.
            </p>
          </div>

          <div className="space-y-4 p-8 rounded-3xl bg-gray-50 border border-gray-100/50">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-950">3. Guided Co-Living</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Shared flats include structured digital agreements covering chores, billing breakdowns, and noise profiles, removing social conflicts from the co-living equation.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Our Stand Against Landlord Exploitation */}
      <div className="bg-[#09090b] text-white p-12 md:p-16 rounded-[36px] space-y-8 mt-12">
        <div className="max-w-2xl space-y-4">
          <span className="text-[10px] font-black text-[#f15a14] tracking-widest uppercase">The Zero-Broker Promise</span>
          <h2 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight">No Hidden Markups. <br />No Exploitative Contracts.</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Traditional student apartment brokers thrive on informational asymmetry—withholding landlord contact info, adding high processing fees, and utilizing confusing legal jargon. RentEase is built on absolute clarity. Our software provides flat pricing structures, direct messaging with verified landlords, and templated, standard leases.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          {[
            "Standardized legal-team approved lease files",
            "Zero broker commission matchings",
            "24-Hour tenant check-in security windows",
            "Instant digitized utility splitting setups"
          ].map((bullet, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-bold text-zinc-200">
              <CheckCircle2 className="w-4 h-4 text-[#f15a14] shrink-0" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}