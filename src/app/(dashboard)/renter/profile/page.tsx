"use client"

import React, { useState, useEffect } from 'react'
import { 
  GraduationCap, Home, Smile, Share2, 
  Save, Plus, X, CheckCircle2, Sparkles, Smartphone, 
  BookOpen, Calendar, DollarSign, MapPin, 
  Loader2, AlertCircle
} from 'lucide-react'
import { publicFetch, serverMutation } from '@/lib/core/server'
import { getUserSession } from '@/lib/core/session'

interface ProfileData {
  phoneNumber: string
  renterType : string
  gender: string
  university: string
  department: string
  academicYear: string
  targetMoveInDate: string
  leaseDuration: string
  budgetRange: {
    min: number
    max: number
  }
  preferredNeighborhoods: string[]
  roomType: string
  lifestyleHabits: {
    cleanliness: string
    sleepSchedule: string
    guestPolicy: string
    diet: string
    smoking: string
    pets: string
  }
  roommateBio: string
  socialLinks: {
    facebook: string
    instagram: string
  }
  bio: string
  name: string
  email: string
  profileCompleted: boolean
}

const DEFAULT_PROFILE: ProfileData = {
  phoneNumber: '',
  renterType: '',
  gender: '',
  university: '',
  department: '',
  academicYear: '',
  targetMoveInDate: '',
  leaseDuration: '',
  budgetRange: { min: 0, max: 0 },
  preferredNeighborhoods: [],
  roomType: '',
  lifestyleHabits: {
    cleanliness: '',
    sleepSchedule: '',
    guestPolicy: '',
    diet: '',
    smoking: '',
    pets: ''
  },
  roommateBio: '',
  socialLinks: {
    facebook: '',
    instagram: ''
  },
  bio: '',
  name: '',
  email: '',
  profileCompleted: false
}

export default function MyProfilePage() {

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'housing' | 'lifestyle' | 'bio'>('basic')
  const [neighborhoodInput, setNeighborhoodInput] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Fetch initial profile data
  useEffect(() => {
    async function loadProfile() {
      try {
        const user = await getUserSession()
        const data = await publicFetch(`/api/users/me/${user?.id}`)
        if (data && data.success && data.data) {
          // Merge with default profile to ensure nested structures exist
          setProfile({
            ...DEFAULT_PROFILE,
            ...data.data,
            budgetRange: {
              ...DEFAULT_PROFILE.budgetRange,
              ...(data.data.budgetRange || {})
            },
            lifestyleHabits: {
              ...DEFAULT_PROFILE.lifestyleHabits,
              ...(data.data.lifestyleHabits || {})
            },
            socialLinks: {
              ...DEFAULT_PROFILE.socialLinks,
              ...(data.data.socialLinks || {})
            },
            // Format Date to YYYY-MM-DD for date input
            targetMoveInDate: data.data.targetMoveInDate 
              ? new Date(data.data.targetMoveInDate).toISOString().split('T')[0]
              : ''
          })
        }
      } catch (err) {
        console.error("Failed to load user profile", err)
        showToast("Could not load profile details. Please try again.", "error")
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  // Calculate profile completeness dynamically
  const calculateCompleteness = () => {
    const fields = [
      profile.phoneNumber,
      profile.renterType,
      profile.gender,
      profile.university,
      profile.department,
      profile.academicYear,
      profile.targetMoveInDate,
      profile.leaseDuration,
      profile.roomType,
      profile.roommateBio,
      profile.budgetRange.min,
      profile.budgetRange.max,
      profile.lifestyleHabits.cleanliness,
      profile.lifestyleHabits.sleepSchedule,
      profile.lifestyleHabits.guestPolicy,
      profile.lifestyleHabits.diet,
      profile.lifestyleHabits.smoking,
      profile.lifestyleHabits.pets,
      profile.bio
    ]

    let filled = fields.filter(val => val !== undefined && val !== null && val !== '' && val !== 0).length
    if (profile.preferredNeighborhoods.length > 0) filled++
    if (profile.socialLinks.facebook || profile.socialLinks.instagram) filled++

    const total = fields.length + 2 // including neighborhoods and socials
    return {
      percentage: Math.round((filled / total) * 100),
      filled,
      total
    }
  }

  const { percentage: completionPercentage } = calculateCompleteness()

  // Handle simple input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log('name,value',name,value)
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof ProfileData] as any),
          [child]: value
        }
      }))
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Handle budget range changes
  const handleBudgetChange = (key: 'min' | 'max', value: number) => {
    setProfile(prev => ({
      ...prev,
      budgetRange: {
        ...prev.budgetRange,
        [key]: value
      }
    }))
  }

  // Handle lifestyle habits updates (pill/selection changes)
  const handleLifestyleSelect = (habitKey: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      lifestyleHabits: {
        ...prev.lifestyleHabits,
        [habitKey]: value
      }
    }))
  }

  // Preferred neighborhood tag actions
  const addNeighborhood = () => {
    const trimmed = neighborhoodInput.trim()
    if (trimmed && !profile.preferredNeighborhoods.includes(trimmed)) {
      setProfile(prev => ({
        ...prev,
        preferredNeighborhoods: [...prev.preferredNeighborhoods, trimmed]
      }))
      setNeighborhoodInput('')
    }
  }

  const removeNeighborhood = (name: string) => {
    setProfile(prev => ({
      ...prev,
      preferredNeighborhoods: prev.preferredNeighborhoods.filter(n => n !== name)
    }))
  }

  // Submit Profile Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const result = await serverMutation(`/api/users/profile`, profile, 'PATCH')
      if (result && result.success) {
        showToast("Profile details updated successfully!", "success")
        if (result.data) {
          setProfile(prev => ({
            ...prev,
            ...result.data,
            targetMoveInDate: result.data.targetMoveInDate 
              ? new Date(result.data.targetMoveInDate).toISOString().split('T')[0]
              : ''
          }))
          console.log('profile data',profile)
        }
      } else {
        showToast(result.message || "Failed to update profile", "error")
      }
    } catch (err) {
      console.error("Save profile error:", err)
      showToast("A network error occurred. Please try again.", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#f15a14]" />
        <p className="text-sm font-semibold text-gray-500">Loading your profile data...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Toast Alert Banner */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
            : 'bg-rose-50 text-rose-800 border-rose-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-rose-500" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          My Renter Profile
        </h1>
        <p className="text-sm text-gray-500">
          Keep your preferences, habits, and information fresh to stand out to landlords and matches.
        </p>
      </div>

      {/* Completion Tracker Banner */}
      <div className="bg-gradient-to-r from-orange-50/50 to-orange-100/30 border border-orange-100/70 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#f15a14]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-3 max-w-lg">
          <div className="flex items-center gap-2 text-[#f15a14]">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-wider">Profile Status</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {completionPercentage === 100 
              ? "Your profile is fully complete!" 
              : "Complete your profile to unlock all features"
            }
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {completionPercentage < 50 && "Add your target move-in date and preferred neighborhoods so landlords can find you easily."}
            {completionPercentage >= 50 && completionPercentage < 80 && "Fill in your lifestyle habits to help us suggest compatible roommates."}
            {completionPercentage >= 80 && completionPercentage < 100 && "Add your social profiles to increase trust in your roommate search!"}
            {completionPercentage === 100 && "Awesome job! Landlords and roommates can view your complete info and matching preferences."}
          </p>
        </div>

        {/* Progress Circle/Indicator */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-48 bg-gray-200/60 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-[#f15a14] h-full transition-all duration-700 ease-out rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-lg font-black text-gray-900 whitespace-nowrap">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-gray-100 overflow-x-auto gap-2 scrollbar-none">
        {[
          { id: 'basic', label: 'Academic & Basics', icon: GraduationCap },
          { id: 'housing', label: 'Lease & Housing', icon: Home },
          { id: 'lifestyle', label: 'Living Habits', icon: Smile },
          { id: 'bio', label: 'Bio & Socials', icon: Share2 }
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-6 py-3.5 border-b-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive 
                  ? 'border-[#f15a14] text-[#f15a14] font-bold' 
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        
        {/* Tab 1: Basic & Academic Info */}
        {activeTab === 'basic' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name || ""} 
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={profile.email || ""} 
                  disabled
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed text-sm focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input 
                  type="text" 
                  name="phoneNumber"
                  value={profile.phoneNumber || ""} 
                  onChange={handleInputChange}
                  placeholder="e.g. +88017XXXXXXXX"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-sm focus:outline-none transition-all duration-200"
                />
              </div>

                <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Renter Type</label>
                <select 
                  name="renterType"
                  value={profile.renterType || ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                >
                  <option value="">Select Renter Type</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="family">Family</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                <select 
                  name="gender"
                  value={profile.gender || ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> University Name
                </label>
                <input 
                  type="text" 
                  name="university"
                  value={profile.university || ""} 
                  onChange={handleInputChange}
                  placeholder="e.g. North South University"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-sm focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Department / Major
                </label>
                <input 
                  type="text" 
                  name="department"
                  value={profile.department || ""} 
                  onChange={handleInputChange}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-sm focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Academic Year / Semester</label>
                <select 
                  name="academicYear"
                  value={profile.academicYear || ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                >
                  <option value="">Select Option</option>
                  <option value="1st Year">1st Year / Freshman</option>
                  <option value="2nd Year">2nd Year / Sophomore</option>
                  <option value="3rd Year">3rd Year / Junior</option>
                  <option value="4th Year">4th Year / Senior</option>
                  <option value="Graduate Student">Graduate Student</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Housing & Lease Preferences */}
        {activeTab === 'housing' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Target Move-in Date
                </label>
                <input 
                  type="date" 
                  name="targetMoveInDate"
                  value={profile.targetMoveInDate || ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Lease Duration Preference</label>
                <select 
                  name="leaseDuration"
                  value={profile.leaseDuration || ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                >
                  <option value="">Select Duration</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Room Type Preferred</label>
                <select 
                  name="roomType"
                  value={profile.roomType || ""} 
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                >
                  <option value="">Select Room Type</option>
                  <option value="Private Room">Private Room</option>
                  <option value="Shared Room">Shared Room</option>
                  <option value="Entire Flat">Entire Flat / Studio</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Monthly Budget Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    placeholder="Min budget"
                    value={profile.budgetRange.min || ''} 
                    onChange={(e) => handleBudgetChange('min', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                  />
                  <input 
                    type="number" 
                    placeholder="Max budget"
                    value={profile.budgetRange.max || ''} 
                    onChange={(e) => handleBudgetChange('max', Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Preferred Neighborhoods
              </label>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. Banani, Bashundhara R/A"
                  value={neighborhoodInput}
                  onChange={(e) => setNeighborhoodInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNeighborhood())}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] text-sm focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={addNeighborhood}
                  className="bg-black hover:bg-zinc-800 text-white rounded-2xl px-5 flex items-center justify-center font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Neighborhood pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.preferredNeighborhoods.map((area) => (
                  <span 
                    key={area}
                    className="inline-flex items-center gap-1.5 bg-orange-50 text-[#f15a14] border border-orange-100 rounded-full py-1.5 px-3 text-xs font-semibold"
                  >
                    {area}
                    <button 
                      type="button" 
                      onClick={() => removeNeighborhood(area)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {profile.preferredNeighborhoods.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No neighborhoods added yet. Add one above!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lifestyle & Living Habits */}
        {activeTab === 'lifestyle' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Cleanliness Level */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Cleanliness Level</label>
                <div className="flex gap-2.5">
                  {['Tidy', 'Moderate', 'Relaxed'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleLifestyleSelect('cleanliness', opt)}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                        profile.lifestyleHabits.cleanliness === opt
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Schedule */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Sleep Schedule</label>
                <div className="flex gap-2.5">
                  {['Early Bird', 'Night Owl'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleLifestyleSelect('sleepSchedule', opt)}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                        profile.lifestyleHabits.sleepSchedule === opt
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guest Policy */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Guest Policy</label>
                <div className="flex gap-2.5">
                  {['No Guests', 'Occasional', 'Frequent'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleLifestyleSelect('guestPolicy', opt)}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                        profile.lifestyleHabits.guestPolicy === opt
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Preference */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Dietary Preference</label>
                <div className="flex gap-2.5">
                  {['Halal', 'Vegetarian', 'No Restrictions'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleLifestyleSelect('diet', opt)}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                        profile.lifestyleHabits.diet === opt
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Smoking */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Smoking</label>
                <div className="flex gap-2.5">
                  {['Non-Smoker', 'Smoker'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleLifestyleSelect('smoking', opt)}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                        profile.lifestyleHabits.smoking === opt
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pets */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Pets</label>
                <div className="flex gap-2.5">
                  {['No Pets', 'Pet Friendly'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleLifestyleSelect('pets', opt)}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                        profile.lifestyleHabits.pets === opt
                          ? 'bg-black border-black text-white'
                          : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Bio & Socials */}
        {activeTab === 'bio' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Short Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={profile.bio || ""}
                onChange={handleInputChange}
                placeholder="Tell us a little bit about yourself, your schedule, etc..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-sm focus:outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Ideal Roommate Description</label>
              <textarea
                name="roommateBio"
                rows={3}
                value={profile.roommateBio || ""}
                onChange={handleInputChange}
                placeholder="What qualities are you looking for in an ideal roommate?"
                className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-sm focus:outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <svg className="w-4.5 h-4.5 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg> facebook Profile Link
                </label>
                <input 
                  type="url" 
                  name="socialLinks.facebook"
                  value={profile.socialLinks?.facebook || ""} 
                  onChange={handleInputChange}
                  placeholder="https://www.facebook.com/username"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-sm focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-pink-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
                  </svg> Instagram Username
                </label>
                <input 
                  type="text" 
                  name="socialLinks.instagram"
                  value={profile.socialLinks?.instagram || ""}   
                  onChange={handleInputChange}
                  placeholder="e.g. username"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-100 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-sm focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Form Footer */}
        <div className="pt-6 border-t border-gray-50 flex justify-end gap-3">
          {activeTab !== 'basic' && (
            <button
              key="btn-back"
              type="button"
              onClick={() => {
                const tabs: ('basic' | 'housing' | 'lifestyle' | 'bio')[] = ['basic', 'housing', 'lifestyle', 'bio']
                const prevIndex = tabs.indexOf(activeTab) - 1
                if (prevIndex >= 0) setActiveTab(tabs[prevIndex])
              }}
              className="px-6 py-3.5 rounded-2xl text-xs font-bold border border-gray-100 hover:border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              Back
            </button>
          )}

          {activeTab !== 'bio' ? (
            <button
              key="btn-continue"
              type="button"
              onClick={() => {
                const tabs: ('basic' | 'housing' | 'lifestyle' | 'bio')[] = ['basic', 'housing', 'lifestyle', 'bio']
                const nextIndex = tabs.indexOf(activeTab) + 1
                if (nextIndex < tabs.length) setActiveTab(tabs[nextIndex])
              }}
              className="px-6 py-3.5 bg-black hover:bg-zinc-800 text-white rounded-2xl text-xs font-bold transition-all duration-200"
            >
              Continue
            </button>
          ) : (
            <button
              key="btn-submit"
              type="submit"
              disabled={saving}
              className="bg-[#f15a14] hover:bg-[#e04f0f] text-white rounded-2xl px-6 py-3.5 flex items-center justify-center font-bold text-xs gap-2 min-w-[140px] shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-98 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile
                </>
              )}
            </button>
          )}
        </div>

      </form>
    </div>
  )
}
