"use client"

import React, { useState } from "react"
import { Send, Phone, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container mx-auto px-6 md:px-16 py-30 bg-white font-sans text-gray-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Head */}
        <div className="space-y-4 mb-16 text-center">
          <div className="inline-block px-3 py-1 bg-[#f15a14]/10 rounded-full text-[#f15a14] text-[10px] font-bold uppercase tracking-wider">
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase text-gray-950">
            We are here to help
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Need roommate help, layout verification, or listing support? Send a note and our team will get back to you within 4 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Quick Info Block */}
          <div className="md:col-span-5 space-y-8 bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-950">Office Locations</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-[#f15a14] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-gray-950 uppercase tracking-wider">Bandung HQ</h4>
                  <p className="text-xs text-gray-500">Jl. Dipati Ukur No. 42, Coblong, Bandung</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Mail className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-gray-950 uppercase tracking-wider">Support Desk</h4>
                  <p className="text-xs text-gray-500">support@rentease.student.com</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Phone className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-extrabold text-gray-950 uppercase tracking-wider">Direct Hotline</h4>
                  <p className="text-xs text-gray-500">+62 22 459 2931</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Contact Form */}
          <div className="md:col-span-7">
            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 p-8 rounded-3xl text-center space-y-3">
                <h3 className="font-extrabold text-lg">Message Submitted!</h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">We've received your request and matched you with a regional support agent. Check your inbox shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-950 uppercase tracking-wider block">Your Name</label>
                    <input required type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-[#f15a14] focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-950 uppercase tracking-wider block">Email Address</label>
                    <input required type="email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-[#f15a14] focus:outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-950 uppercase tracking-wider block">Subject</label>
                  <input required type="text" placeholder="e.g. Deposit Protection Inquiry" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-[#f15a14] focus:outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-950 uppercase tracking-wider block">Details Message</label>
                  <textarea required rows={4} className="w-full bg-white border border-gray-200 rounded-xl p-4 text-xs focus:ring-2 focus:ring-[#f15a14] focus:outline-none" />
                </div>

                <Button type="submit" className="w-full bg-gray-950 hover:bg-gray-900 text-white font-bold py-6 rounded-xl text-xs transition-all flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" /> Submit Support Ticket
                </Button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}