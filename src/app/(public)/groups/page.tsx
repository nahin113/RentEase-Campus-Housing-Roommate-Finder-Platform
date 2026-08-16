"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  SlidersHorizontal, 
  X, 
  MessageSquare
} from "lucide-react";
import { publicFetch, serverMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";
import Navbar from "@/components/home/Navbar";

interface Member {
  _id: string;
  name: string;
  image?: string;
  email: string;
  renterType?: string;
  department?: string;
  academicYear?: string;
  university?: string;
  gender?: string;
}

interface GroupData {
  _id: string;
  name: string;
  creatorId: string;
  members: string[];
  groupGenderType: string;
  description?: string;
  isLocked: boolean;
  acceptedFlatId?: string | null;
  attributes: {
    minAge: number;
    maxAge: number;
    mealBudgetRange: { min: number; max: number };
    rentBudgetRange: { min: number; max: number };
    preferredOccupation: string[];
    tags: string[];
  };
  membersDetails: Member[];
}

const DEFAULT_LIFESTYLE_TAGS = [
  "Non-Smoker",
  "Highly Clean",
  "Quiet/Study Environment",
  "Job Holders Only",
  "Students Welcome",
  "No Late Night Parties",
  "Early Riser",
  "Night Owl",
  "Shared Cooking",
  "Pet Friendly"
];

export default function FindGroupsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [allGroups, setAllGroups] = useState<GroupData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [maxRent, setMaxRent] = useState<number>(30000);
  const [maxMeal, setMaxMeal] = useState<number>(15000);
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Detailed Modal states
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [applying, setApplying] = useState(false);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await publicFetch("/api/groups");
      if (res && res.success && res.data) {
        setAllGroups(res.data);
      }
    } catch (err) {
      console.error("Failed to load roommate groups", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleOccupationToggle = (occ: string) => {
    if (selectedOccupations.includes(occ)) {
      setSelectedOccupations(selectedOccupations.filter(o => o !== occ));
    } else {
      setSelectedOccupations([...selectedOccupations, occ]);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter groups logic
  const filteredGroups = allGroups.filter((group) => {
    // 1. Strict Gender Matching: Show only matching user gender if user is logged in
    if (user?.gender) {
      const userGender = user.gender === "female" ? "female" : "male";
      if (group.groupGenderType !== userGender) {
        return false;
      }
    }

    // 2. Keyword Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchName = group.name.toLowerCase().includes(query);
      const matchDesc = group.description?.toLowerCase().includes(query) || false;
      if (!matchName && !matchDesc) return false;
    }

    // 3. Rent Budget Range (Overlapping check)
    // Matches if group rent range overlaps with user maxRent criteria (meaning min budget is within range)
    if (group.attributes.rentBudgetRange?.min > maxRent) {
      return false;
    }

    // 4. Meal Budget
    if (group.attributes.mealBudgetRange?.min > maxMeal) {
      return false;
    }

    // 5. Occupations Filter
    if (selectedOccupations.length > 0) {
      const groupOccs = group.attributes.preferredOccupation || [];
      const hasMatch = selectedOccupations.some(o => 
        groupOccs.some(go => go.toLowerCase() === o.toLowerCase()) || groupOccs.includes("any")
      );
      if (!hasMatch) return false;
    }

    // 6. Lifestyle Tags Filter
    if (selectedTags.length > 0) {
      const groupTags = group.attributes.tags || [];
      const hasAllTags = selectedTags.every(t => groupTags.includes(t));
      if (!hasAllTags) return false;
    }

    return true;
  });

  const handleApplyToJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !user?.id) return;
    setApplying(true);
    try {
      const res = await serverMutation(
        `/api/groups/request`,
        { senderId: user.id, groupId: selectedGroup._id, message: applyMessage },
        "POST"
      );
      if (res && res.success) {
        toast.success("Application to join roommates group submitted!");
        setIsApplyModalOpen(false);
        setApplyMessage("");
        setSelectedGroup(null);
        fetchGroups();
      } else {
        toast.error(res?.message || "Failed to submit request");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans pb-16">
      <Navbar />

      <div className="container mx-auto px-6 md:px-16 pt-28 space-y-8">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight flex flex-col md:flex-row items-center gap-2">
            <Users className="w-8 h-8 text-[#f15a14]" /> Discover Roommate Groups
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-xl">
            {user?.gender 
              ? `Showing roommate groups matching your gender (${user.gender === "female" ? "Females Only" : "Males Only"}).`
              : "Sign in to see groups compatible with your profile details."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
            <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#f15a14]" /> Discovery Filters
            </h3>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-400 uppercase">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. Skyline Squad"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Rent Budget Range */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>Max Rent Limit</span>
                <span className="text-[#f15a14]">৳{maxRent.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="40000"
                step="1000"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
                className="w-full accent-[#f15a14]"
              />
            </div>

            {/* Meal Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                <span>Max Meal Expense</span>
                <span className="text-[#f15a14]">৳{maxMeal.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="15000"
                step="500"
                value={maxMeal}
                onChange={(e) => setMaxMeal(Number(e.target.value))}
                className="w-full accent-[#f15a14]"
              />
            </div>

            {/* Occupation Checkboxes */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase block">Occupation Preferred</label>
              <div className="flex flex-col gap-2">
                {["student", "job_holder", "freelancer"].map((occ) => (
                  <label key={occ} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer capitalize">
                    <input
                      type="checkbox"
                      checked={selectedOccupations.includes(occ)}
                      onChange={() => handleOccupationToggle(occ)}
                      className="accent-[#f15a14] rounded"
                    />
                    {occ.replace("_", " ")}
                  </label>
                ))}
              </div>
            </div>

            {/* Lifestyle tags selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-400 uppercase block">Filter by Habit Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_LIFESTYLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`text-[9px] font-bold px-2 py-1 rounded-full border transition-all ${
                        isSelected 
                          ? "bg-orange-50 border-[#f15a14] text-[#f15a14]"
                          : "bg-gray-50 border-gray-150 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Group Cards Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                <div className="w-8 h-8 border-4 border-t-[#f15a14] border-gray-150 rounded-full animate-spin" />
                <span className="text-xs text-gray-400 font-bold">Scanning roommate groups...</span>
              </div>
            ) : filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredGroups.map((groupItem) => (
                  <div key={groupItem._id} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          groupItem.groupGenderType === 'female'
                            ? "bg-pink-50 text-pink-700 border-pink-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                          {groupItem.groupGenderType} group
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {groupItem.membersDetails?.length || 1} Member{groupItem.membersDetails?.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-gray-950 tracking-tight">{groupItem.name}</h3>
                      {groupItem.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{groupItem.description}</p>
                      )}

                      {/* Budget Badge */}
                      <div className="text-[10px] font-extrabold text-gray-700 bg-gray-50 border border-gray-100 p-2 rounded-xl">
                        Rent: ৳{groupItem.attributes.rentBudgetRange?.min?.toLocaleString()} - ৳{groupItem.attributes.rentBudgetRange?.max?.toLocaleString()}/mo
                        <span className="block text-[9px] text-gray-400 font-medium mt-0.5">
                          Meal Budget: ৳{groupItem.attributes.mealBudgetRange?.min?.toLocaleString()} - ৳{groupItem.attributes.mealBudgetRange?.max?.toLocaleString()}/mo
                        </span>
                      </div>

                      {/* Occupations */}
                      <div className="flex flex-wrap gap-1.5">
                        {groupItem.attributes.preferredOccupation?.map((occ) => (
                          <span key={occ} className="text-[9px] font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md uppercase">
                            {occ}
                          </span>
                        ))}
                      </div>

                      {/* Habit Badges */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {groupItem.attributes.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[9px] font-bold bg-orange-50/50 text-[#f15a14] border border-orange-100/50 px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                        {groupItem.attributes.tags && groupItem.attributes.tags.length > 3 && (
                          <span className="text-[8px] font-black bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded-full">
                            +{groupItem.attributes.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedGroup(groupItem)}
                      className="w-full bg-gray-950 hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                    >
                      View Group & Apply
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center space-y-2">
                <Users className="w-10 h-10 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-950">No Roommate Groups Found</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Adjust filters or search queries. If logged in, strict gender matching displays roommate groups of your gender.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Group Detail Modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto relative space-y-6">
            <button 
              onClick={() => setSelectedGroup(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                selectedGroup.groupGenderType === 'female'
                  ? "bg-pink-50 text-pink-700 border-pink-100"
                  : "bg-blue-50 text-blue-700 border-blue-100"
              }`}>
                {selectedGroup.groupGenderType} group
              </span>
              <h2 className="text-xl font-black text-gray-950 tracking-tight mt-2">{selectedGroup.name}</h2>
              {selectedGroup.description && (
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{selectedGroup.description}</p>
              )}
            </div>

            {/* Criteria Grid */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Age Limits</span>
                <span className="text-xs font-black text-gray-950">{selectedGroup.attributes.minAge || 18} - {selectedGroup.attributes.maxAge || 35} yrs</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Preferred Job</span>
                <span className="text-xs font-black text-gray-950 capitalize">{selectedGroup.attributes.preferredOccupation?.join(", ") || "Any"}</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Rent Budget</span>
                <span className="text-xs font-black text-gray-950">৳{selectedGroup.attributes.rentBudgetRange?.min?.toLocaleString()} - ৳{selectedGroup.attributes.rentBudgetRange?.max?.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Meal Budget</span>
                <span className="text-xs font-black text-gray-950">৳{selectedGroup.attributes.mealBudgetRange?.min?.toLocaleString()} - ৳{selectedGroup.attributes.mealBudgetRange?.max?.toLocaleString()}</span>
              </div>
            </div>

            {/* Habit badges */}
            {selectedGroup.attributes.tags && selectedGroup.attributes.tags.length > 0 && (
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase block">Lifestyle Preferences</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGroup.attributes.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-black bg-orange-50 text-[#f15a14] border border-orange-100 px-2.5 py-1 rounded-md uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Members Details */}
            <div className="space-y-3">
              <span className="text-[9px] font-bold text-gray-400 uppercase block">Group Members ({selectedGroup.membersDetails?.length})</span>
              <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto pr-2">
                {selectedGroup.membersDetails?.map((m) => (
                  <div key={m._id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-150 bg-gray-50 shrink-0">
                        <Image 
                          src={m.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                          alt={m.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-950">
                          {m.name} {m._id === selectedGroup.creatorId && <span className="text-[8px] bg-orange-100 text-[#f15a14] px-1 rounded-full font-black">CREATOR</span>}
                        </h4>
                        <p className="text-[9px] text-gray-400 font-medium">
                          {m.university} • {m.department}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Control block */}
            <div className="pt-6 border-t border-gray-150">
              {user ? (
                // Disable joining if already a member
                selectedGroup.members.includes(user.id) ? (
                  <div className="text-center p-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500 font-semibold">
                    ✓ You are already a member of this group
                  </div>
                ) : (
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white font-bold py-3.5 rounded-2xl text-xs shadow-md shadow-orange-500/10 transition-colors"
                  >
                    Apply to Join Group
                  </button>
                )
              ) : (
                <div className="text-center p-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs text-gray-500 font-semibold">
                  Please sign in to apply for this roommate group
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application message submodal */}
      {isApplyModalOpen && selectedGroup && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 max-w-sm w-full relative space-y-4">
            <button 
              onClick={() => setIsApplyModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-sm font-black text-gray-950 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#f15a14]" /> Send Join Application
              </h3>
              <p className="text-[10px] text-gray-400 leading-normal">
                Write a brief message introducing yourself and why you're a good fit for {selectedGroup.name}.
              </p>
            </div>

            <form onSubmit={handleApplyToJoin} className="space-y-4">
              <textarea
                rows={3}
                placeholder="e.g. Hi! I am a final year CSE student, highly clean and quiet. I would love to team up..."
                value={applyMessage}
                onChange={(e) => setApplyMessage(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none resize-none"
              />

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-gray-100 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-6 py-2 bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/10 transition-colors"
                >
                  {applying ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
