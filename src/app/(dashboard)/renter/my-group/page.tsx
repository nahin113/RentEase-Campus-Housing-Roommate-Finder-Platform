"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  ShieldAlert, 
  LogOut, 
  Sparkles,
  UserPlus,
  Check,
  X
} from "lucide-react";
import { publicFetch, serverMutation } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";

const DEFAULT_PREFERENCES = [
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
  joinRequests?: Array<{
    applicantId: string;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  }>;
  invitations?: Array<{
    invitedUserId: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  }>;
  membersDetails: Member[];
  joinRequestsDetails?: Member[];
  invitesDetails?: Member[];
}

export default function MyGroupPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states for creating a group
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [minRent, setMinRent] = useState(5000);
  const [maxRent, setMaxRent] = useState(20000);
  const [minMeal, setMinMeal] = useState(3000);
  const [maxMeal, setMaxMeal] = useState(8000);
  const [occupations, setOccupations] = useState<string[]>(["student"]);
  const [tags, setTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState("");

  // Invite user state
  const [inviteUserIdInput, setInviteUserIdInput] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchMyGroup = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await publicFetch(`/api/groups/my-group/${user.id}`);
      if (res && res.success && res.data) {
        setGroup(res.data);
      } else {
        setGroup(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMyGroup();
    }
  }, [user?.id]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setSubmitting(true);
    try {
      const payload = {
        name,
        description,
        attributes: {
          minAge,
          maxAge,
          mealBudgetRange: { min: minMeal, max: maxMeal },
          rentBudgetRange: { min: minRent, max: maxRent },
          preferredOccupation: occupations,
          tags
        }
      };

      const res = await serverMutation(`/api/groups/create/${user.id}`, payload, "POST");
      if (res && (res.success || res._id)) {
        toast.success("Roommate Group created successfully!");
        fetchMyGroup();
      } else {
        toast.error(res?.message || "Failed to create group");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group || !user?.id) return;
    const confirmLeave = confirm(
      group.creatorId === user.id
        ? "Warning: As the creator, leaving will dissolve this group. Proceed?"
        : "Are you sure you want to leave this group?"
    );
    if (!confirmLeave) return;

    try {
      const res = await serverMutation(`/api/groups/leave/${group._id}/${user.id}`, {}, "POST");
      if (res && res.success) {
        toast.success(group.creatorId === user.id ? "Group dissolved" : "You left the group");
        setGroup(null);
      } else {
        toast.error(res?.message || "Failed to leave group");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!group || !inviteUserIdInput.trim()) return;
    setInviting(true);
    try {
      const res = await serverMutation(
        `/api/groups/invite/${group._id}`,
        { invitedUserId: inviteUserIdInput.trim() },
        "POST"
      );
      if (res && res.success) {
        toast.success("Invitation sent successfully!");
        setInviteUserIdInput("");
        fetchMyGroup();
      } else {
        toast.error(res?.message || "Failed to send invitation");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setInviting(false);
    }
  };

  const handleOccupationToggle = (occ: string) => {
    if (occupations.includes(occ)) {
      setOccupations(occupations.filter((o) => o !== occ));
    } else {
      setOccupations([...occupations, occ]);
    }
  };

  const handleRespondJoin = async (applicantId: string, action: 'accepted' | 'rejected') => {
    if (!group) return;
    try {
      const res = await serverMutation(
        `/api/groups/respond-join/${group._id}`,
        { applicantId, action },
        "POST"
      );
      if (res && res.success) {
        toast.success(`Join request ${action} successfully!`);
        fetchMyGroup();
      } else {
        toast.error(res?.message || "Failed to update join request");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-t-[#f15a14] border-gray-150 rounded-full animate-spin" />
        <span className="text-xs text-gray-400 font-semibold font-sans">Syncing Group Info...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 flex items-center gap-3">
          <Users className="w-8 h-8 text-[#f15a14]" /> My Roommate Group
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Coordinate, list group specifications, and manage members to secure properties together.
        </p>
      </div>

      {group ? (
        /* Group exists view */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 relative overflow-hidden">
              {group.isLocked && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Locked - Application Approved
                </div>
              )}
              
              <div className="space-y-2">
                <span className="text-[10px] font-black bg-orange-50 text-[#f15a14] px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Active Roommates Group ({group.groupGenderType} only)
                </span>
                <h2 className="text-2xl font-black text-gray-950 tracking-tight">{group.name}</h2>
                {group.description && (
                  <p className="text-xs text-gray-600 leading-relaxed pt-2 border-t border-gray-50">{group.description}</p>
                )}
              </div>

              {/* Structured Attributes Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Age Range</span>
                  <span className="text-xs font-black text-gray-950">
                    {group.attributes.minAge || 18} - {group.attributes.maxAge || 35} Years
                  </span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Rent Budget</span>
                  <span className="text-xs font-black text-gray-950">
                    ৳{group.attributes.rentBudgetRange?.min?.toLocaleString() || "5,000"} - ৳{group.attributes.rentBudgetRange?.max?.toLocaleString() || "20,000"}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Meal Budget</span>
                  <span className="text-xs font-black text-gray-950">
                    ৳{group.attributes.mealBudgetRange?.min?.toLocaleString() || "3,000"} - ৳{group.attributes.mealBudgetRange?.max?.toLocaleString() || "8,000"}
                  </span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Preferred Occupations</span>
                  <span className="text-xs font-black text-gray-950 capitalize">
                    {group.attributes.preferredOccupation?.join(", ") || "Any"}
                  </span>
                </div>
              </div>

              {/* Lifestyle Tags list */}
              {group.attributes.tags && group.attributes.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">Lifestyle Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {group.attributes.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-black bg-orange-50 text-[#f15a14] border border-orange-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Member Details list */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-950">Group Members ({group.membersDetails.length})</h3>
              <div className="divide-y divide-gray-100">
                {group.membersDetails.map((member) => (
                  <div key={member._id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-150 bg-gray-50 shrink-0">
                        <Image 
                          src={member.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                          alt={member.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-950">
                          {member.name} {member._id === group.creatorId && <span className="text-[9px] bg-orange-100 text-[#f15a14] px-1.5 py-0.5 rounded-full ml-1 font-black">CREATOR</span>}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {member.university || "No University"} • {member.department || "No Dept"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-md uppercase">
                      {member.gender || "Other"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Requests (Visible to Creator) */}
            {group.creatorId === user?.id && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-950">Pending Join Requests ({(group.joinRequests || []).filter(r => r.status === 'pending').length})</h3>
                {((group.joinRequests || []).filter(r => r.status === 'pending').length) > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {(group.joinRequests || []).filter(r => r.status === 'pending').map((reqItem) => {
                      const applicant = group.joinRequestsDetails?.find(u => u._id === reqItem.applicantId);
                      if (!applicant) return null;
                      return (
                        <div key={reqItem.applicantId} className="py-4 flex flex-col gap-2 first:pt-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-150 bg-gray-50 shrink-0">
                                <Image 
                                  src={applicant.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                                  alt={applicant.name} 
                                  fill 
                                  className="object-cover" 
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-950">{applicant.name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">
                                  {applicant.university} • {applicant.department}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleRespondJoin(reqItem.applicantId, 'accepted')}
                                className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleRespondJoin(reqItem.applicantId, 'rejected')}
                                className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          {reqItem.message && (
                            <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-2.5 leading-normal italic">
                              "{reqItem.message}"
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No pending requests to join.</p>
                )}
              </div>
            )}

            {/* Pending Invitations status */}
            {group.creatorId === user?.id && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-950">Sent Invitations</h3>
                {((group.invitations || []).filter(inv => inv.status === 'pending').length) > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {(group.invitations || []).filter(inv => inv.status === 'pending').map((invItem) => {
                      const invitedUser = group.invitesDetails?.find(u => u._id === invItem.invitedUserId);
                      return (
                        <div key={invItem.invitedUserId} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                              <Image 
                                src={invitedUser?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                                alt={invitedUser?.name || "User"} 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-gray-950">{invitedUser?.name || "Invited User"}</h4>
                              <p className="text-[9px] text-gray-400 font-medium">Pending Response</p>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                            Pending
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No pending invitations.</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Invite and Leave */}
          <div className="space-y-6">
            
            {/* Invite Form */}
            {!group.isLocked && (
              <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="text-xs font-black uppercase text-gray-950 tracking-wider flex items-center gap-1.5">
                  <UserPlus className="w-4 h-4 text-[#f15a14]" /> Invite Roommate
                </h4>
                <p className="text-[10px] text-gray-400 leading-normal">
                  Type user database ID to invite a roommate matching the group requirements.
                </p>
                <form onSubmit={handleInviteUser} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Enter user ID..."
                    value={inviteUserIdInput}
                    onChange={(e) => setInviteUserIdInput(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={inviting}
                    className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl py-2.5 text-xs font-bold shadow-md shadow-orange-500/10"
                  >
                    {inviting ? "Sending invite..." : "Send Invitation"}
                  </button>
                </form>
              </div>
            )}

            {/* Leave Group Action Card */}
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-950 tracking-wider">Group Actions</h4>
              <button
                onClick={handleLeaveGroup}
                disabled={group.isLocked}
                className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold border transition-colors ${
                  group.isLocked
                    ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white border-red-200 hover:bg-red-50 text-red-600"
                }`}
              >
                <LogOut className="w-4 h-4" />
                {group.creatorId === user?.id ? "Dissolve Group" : "Leave Group"}
              </button>
              {group.isLocked && (
                <p className="text-[9px] text-gray-400 font-medium leading-normal text-center">
                  ⚠️ Leave group disabled. Group details locked due to approved rent application.
                </p>
              )}
            </div>

          </div>

        </div>
      ) : (
        /* Create group form view */
        <form onSubmit={handleCreateGroup} className="space-y-8 bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
              <Sparkles className="w-4 h-4 text-[#f15a14]" /> Group Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Group Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Skyline Roommates Squad"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Short Description</label>
                <textarea 
                  rows={2}
                  placeholder="Brief summary describing roommate preferences, routines, study schedules..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none resize-none transition-all duration-200"
                />
              </div>

              {/* Age Range */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Age Criteria</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    placeholder="Min age"
                    value={minAge}
                    onChange={(e) => setMinAge(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Max age"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Preferred Occupations */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Preferred Occupations</label>
                <div className="flex gap-4 pt-1.5">
                  {["student", "job_holder", "freelancer", "any"].map((occ) => (
                    <label key={occ} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer capitalize">
                      <input 
                        type="checkbox" 
                        checked={occupations.includes(occ)}
                        onChange={() => handleOccupationToggle(occ)}
                        className="accent-[#f15a14]"
                      />
                      {occ.replace("_", " ")}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rent Budget Range */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Monthly Rent Budget Range (TK)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    placeholder="Min rent"
                    value={minRent}
                    onChange={(e) => setMinRent(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs"
                  />
                  <input 
                    type="number" 
                    placeholder="Max rent"
                    value={maxRent}
                    onChange={(e) => setMaxRent(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs"
                  />
                </div>
              </div>

              {/* Meal Budget Range */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Monthly Meal Budget Range (TK)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" 
                    placeholder="Min meal"
                    value={minMeal}
                    onChange={(e) => setMinMeal(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs"
                  />
                  <input 
                    type="number" 
                    placeholder="Max meal"
                    value={maxMeal}
                    onChange={(e) => setMaxMeal(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs"
                  />
                </div>
              </div>

              {/* Group Attributes Multi-Select Tag System */}
              <div className="space-y-4 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                  Select Group Lifestyle Tags
                </label>
                
                {/* Visual Quick Select Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {DEFAULT_PREFERENCES.map((pref) => {
                    const isSelected = tags.includes(pref);
                    return (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setTags(tags.filter((t) => t !== pref));
                          } else {
                            setTags([...tags, pref]);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-full text-xs font-bold border transition-all ${
                          isSelected
                            ? "bg-orange-50 border-[#f15a14] text-[#f15a14] scale-95"
                            : "bg-white border-gray-150 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Input Tag Box */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type custom tag... (e.g. Early Riser, Shared Cooking)"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-150 focus:border-[#f15a14] text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = customTagInput.trim();
                      if (trimmed && !tags.includes(trimmed)) {
                        setTags([...tags, trimmed]);
                        setCustomTagInput("");
                      }
                    }}
                    className="px-5 bg-gray-950 text-white font-bold rounded-2xl text-xs hover:bg-gray-800 transition-colors"
                  >
                    Add custom
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-11 px-8 shadow-md shadow-orange-500/20 transition-all duration-200"
            >
              {submitting ? "Creating roommate group..." : "Create Roommate Group"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
