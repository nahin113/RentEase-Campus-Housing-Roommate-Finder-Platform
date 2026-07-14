"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

interface FAQItem {
  q: string
  a: string
  category: string
}

const FAQS: FAQItem[] = [
  {
    category: "Rent Deposits",
    q: "How does RentEase Deposit Escrow Protection work?",
    a: "When you sign a sublease agreement through RentEase, your deposit is held securely in an independent third-party escrow account. The landlord only receives the funds once you successfully check in and verify the flat matches your listing description."
  },
  {
    category: "Co-Living Dynamics",
    q: "Can I choose my co-living roommates?",
    a: "Yes! During your booking submission, you'll fill out your living profile. Our system matching matrix automatically matches you with other students studying nearby who share your schedule, noise preferences, and cleanliness habits."
  },
  {
    category: "Safety & Quality",
    q: "What does 'RentEase Verified' actually mean?",
    a: "It means a local RentEase representative has visited the flat in person. We test the hot water, confirm high-speed Wi-Fi signals, verify safety locks on windows, and double-check exact walking times to local university gates."
  }
]

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="container mx-auto px-6 md:px-16 py-30 bg-white font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        
        {/* Support Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase text-gray-950">Help Hub</h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Instant answers to everything about student rent protection and flat logistics.</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search help articles (e.g. 'escrow protection')..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-12 pr-4 py-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f15a14] transition-all"
          />
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-6">Frequently Answered Issues</h3>
          
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div 
                key={index} 
                className="border border-gray-100 rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-[#f15a14] tracking-widest">{faq.category}</span>
                    <h4 className="text-sm font-extrabold text-gray-950 leading-snug">{faq.q}</h4>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-xs text-gray-500 leading-relaxed border-t border-gray-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}