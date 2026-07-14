"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Clock, User, Bookmark, Heart, Share2, Sparkles } from "lucide-react"

interface FullArticle {
  id: string
  title: string
  subtitle: string
  category: string
  image: string
  readTime: string
  author: string
  authorRole: string
  paragraphs: string[]
}

const FULL_BLOG_DATA: FullArticle[] = [
  {
    id: "post-1",
    title: "How to Split Utilities with Co-Living Roommates Fairly",
    subtitle: "Ditch the sticky notes and tension. Here is the exact billing workflow to keep co-living relationships stress-free.",
    category: "Co-Living Harmony",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000&auto=format&fit=crop&q=80",
    readTime: "4 min read",
    author: "Rendra Pratama",
    authorRole: "RentEase Community Lead",
    paragraphs: [
      "The honeymoon phase of co-living usually ends the moment the first utility bill arrives. When a single invoice covers electricity, gas, water, and high-speed fiber internet, dividing it simply by the number of roommates frequently leads to quiet resentment. Someone goes away for the weekend, another runs a private server, and suddenly people are tracking showers.",
      "The first step is establishing a standard structure. RentEase recommends setting up a dedicated shared portal account rather than letting one individual assume all financial liability. Your digital roommate charter should establish clear ground rules: communal bills (like trash and basic internet) are divided equally, while variable bills (like winter heating or heavy AC usage) have agreed caps.",
      "To prevent payment delays, connect a shared ledger app. Don't wait for manual wire transfers; establish a firm 'due within 48 hours of invoice upload' policy. When guidelines are standardized and transparently tracked on a dashboard, utility bills cease to be emotional debates and become simple utility routines."
    ]
  },
  {
    id: "post-2",
    title: "5 Crucial Items to Check Before Signing a Flat Sublease",
    subtitle: "Protect your rent money and discover legal pitfalls hiding inside standard rental contracts.",
    category: "Tenant Legalities",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000&auto=format&fit=crop&q=80",
    readTime: "6 min read",
    author: "Amara Lubis",
    authorRole: "Tenant Advocacy Specialist",
    paragraphs: [
      "Signing a rental contract is a binding commitment, yet many students sign leases within minutes of skimming. Landlords often use template forms containing invalid clauses or custom terms that shift maintenance burdens onto you.",
      "First, analyze the Deposit Return Timeline. Standard regulations state that deposits must be returned within 14 to 30 days of the lease ending. If your contract says 'at landlord's discretion' or extends past 60 days, demand a rewrite. Second, inspect the maintenance thresholds. You should not be responsible for structural appliances like water heaters or electrical grids.",
      "Third, look for joint liability clauses. If your co-living roommate leaves their studies, are you legally bound to pay their share? At RentEase, we actively advocate for individual room-by-room leases to protect students from partner liabilities. Always document flat conditions on camera during move-in to safeguard your security deposit."
    ]
  },
  {
    id: "post-3",
    title: "Optimizing Small Student Study Desks for Productivity",
    subtitle: "Designing ergonomic study environments that maximize mental energy and save room space.",
    category: "Space Design",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1000&auto=format&fit=crop&q=80",
    readTime: "3 min read",
    author: "Zaky Hardi",
    authorRole: "Interior Architecture Consultant",
    paragraphs: [
      "Living in a compact student flat means your bedroom is also your office, library, and resting sanctuary. If your desk is cluttered, your cognitive load is constantly elevated. Organizing your workspace directly translates into better academic performance.",
      "Start by auditing your layout. Your screen should reside at eye level, preventing slouching during long hours of studying. Swap bulky desk lamps for a screen-mounted monitor bar to reclaim crucial physical desk space. Introduce functional cable channels beneath your desk to keep cords organized.",
      "Finally, incorporate soft, warm light sources rather than relying on harsh overhead fluorescent bulbs. A dedicated desk plant and clean work surface help separate study time from sleep, keeping you energized and focused."
    ]
  }
]

export default function BlogPage() {
  const [likes, setLikes] = useState<Record<string, number>>({ "post-1": 42, "post-2": 89, "post-3": 31 })
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  const handleLike = (id: string) => {
    const alreadyLiked = liked[id]
    setLiked(prev => ({ ...prev, [id]: !alreadyLiked }))
    setLikes(prev => ({
      ...prev,
      [id]: alreadyLiked ? prev[id] - 1 : prev[id] + 1
    }))
  }

  return (
    <div className="container mx-auto px-6 md:px-16 py-30 bg-white font-sans text-gray-900">
      
      {/* 1. Editorial Header */}
      <div className="mb-20 text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f15a14]/10 rounded-full text-[#f15a14] text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> RentEase Journal
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-gray-950 leading-none">
          The RentEase <br /> Knowledge Stack
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-xl mx-auto">
          Deep, completely uncensored guides written by tenant legal advocates and student advisors to help you manage leases, finances, and co-living dynamics.
        </p>
      </div>

      {/* 2. Full Article Column Stream */}
      <div className="space-y-28 max-w-4xl mx-auto">
        {FULL_BLOG_DATA.map((article) => {
          const isLiked = liked[article.id]
          
          return (
            <article 
              key={article.id} 
              className="border-b border-gray-100 pb-20 last:border-0 last:pb-0 space-y-8"
            >
              {/* Category Pill & Time Info */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="bg-gray-950 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  {article.category}
                </span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#f15a14]" /> {article.readTime}
                </span>
              </div>

              {/* Title Header */}
              <div className="space-y-3">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-950 uppercase leading-snug">
                  {article.title}
                </h2>
                <p className="text-base text-gray-500 font-medium leading-relaxed">
                  {article.subtitle}
                </p>
              </div>

              {/* Immersive Panoramic Visual */}
              <div className="relative h-[250px] md:h-[400px] w-full rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm">
                <Image 
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Author & Interaction Command Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-950 text-white font-black text-xs flex items-center justify-center">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-950">{article.author}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{article.authorRole}</p>
                  </div>
                </div>

                {/* Social Micro Interactions */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleLike(article.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isLiked 
                        ? "bg-red-50 text-red-500 border-red-100" 
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
                    <span>{likes[article.id]}</span>
                  </button>

                  <button className="p-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 rounded-xl transition-all">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Full Article Text Block */}
              <div className="space-y-6 text-sm text-gray-600 leading-relaxed max-w-3xl">
                {article.paragraphs.map((para, index) => (
                  <p key={index} className="first-letter:text-2xl first-letter:font-black first-letter:text-[#f15a14] first-letter:mr-1">
                    {para}
                  </p>
                ))}
              </div>

            </article>
          )
        })}
      </div>

    </div>
  )
}