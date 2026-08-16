import Link from "next/link";
import { publicFetch } from "@/lib/core/server";
import { 
  MapPin, GraduationCap, Calendar, DollarSign, 
  Home, ShieldCheck, ArrowLeft, User
} from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserSession } from "@/lib/core/session";
import InviteButton from "@/components/roommates/InviteButton";

export default async function RoommateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let user = null;
  let error: string | null = null;
  let groupData = null;
  let currentUser = null;

  try {
    currentUser = await getUserSession();
    const current = currentUser?.id;
    const target = id;
    const res = await publicFetch(`/api/v1/${current}/${target}`);
    if (res?.error) {
      error = res.error;
    } else if (res?.success === false) {
      error = res.message || "Failed to load user profile";
    } else {
      user = res?.data || res;
    }

    if (currentUser?.id) {
      const groupRes = await publicFetch(`/api/groups/my-group/${currentUser.id}`);
      if (groupRes && groupRes.success && groupRes.data) {
        groupData = groupRes.data;
      }
    }
  } catch (err) {
    console.error("Failed to load user or group data", err);
    error = "Failed to load user profile";
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-slate-50 dark:bg-[#0f172a]">
        <div className="text-slate-500 text-xl">{error || "User not found"}</div>
        <Link href="/roommates" className="text-[#f15a14] hover:underline">← Back to roommates</Link>
      </div>
    );
  }

  const ProgressBar = ({ label, value, max = 100 }: { label: string, value: number, max?: number }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
          <span className="text-slate-500">{Math.round(percentage)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-[#f15a14] rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  const score = user.matchScore || 0;
  const breakdown = user.matchBreakdown || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <Link href="/roommates" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#f15a14] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to matches
        </Link>
 
        {/* Hero Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-black text-[#f15a14]">{score}%</span>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">Match</span>
            </div>
          </div>

          <Avatar className="w-32 h-32 md:w-40 md:h-40 text-5xl font-bold border-4 border-white dark:border-slate-900 shadow-lg shrink-0">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-400">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-16 h-16" />}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-4 flex-1">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                {user.name || "Anonymous User"}
                {user.profileCompleted && (
                  <span title="Verified Profile">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </span>
                )}
              </h1>
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> 
                {user.location || user.preferredNeighborhoods?.join(", ") || "Location unlisted"}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <InviteButton
                currentUserId={currentUser?.id || null}
                groupId={groupData?._id || null}
                invitedUserId={id}
                groupMembers={groupData?.members || []}
                invitations={groupData?.invitations || []}
                isLocked={!!groupData?.isLocked}
                isGroupCreator={groupData?.creatorId === currentUser?.id}
                hasGroup={!!groupData}
              />
              {user.socials?.linkedin && (
                <Link href={user.socials.linkedin} target="_blank" className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-blue-600 transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </Link>
              )}
              {user.socials?.instagram && (
                <Link href={user.socials.instagram} target="_blank" className="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-pink-600 transition-colors">
                  <FaInstagram className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-8">
            
            {/* About Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-6">About & Ideal Roommate</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">About Me</h3>
                  <blockquote className="pl-4 border-l-4 border-[#f15a14] italic text-slate-600 dark:text-slate-300">
                    {user.bio || "No bio provided."}
                  </blockquote>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Looking For</h3>
                  <blockquote className="pl-4 border-l-4 border-blue-500 italic text-slate-600 dark:text-slate-300">
                    {user.roommateBio || "No specific roommate preferences listed."}
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Lifestyle Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-6">Lifestyle & Habits</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {user.lifestyleHabits && Object.entries(user.lifestyleHabits).map(([key, val]) => (
                  <div key={key} className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium capitalize text-sm">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Match Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-6">Match Breakdown</h2>
              <div className="space-y-6">
                <ProgressBar label="Location & Uni" value={breakdown.locationAndUniversity || 0} max={30} />
                <ProgressBar label="Budget Match" value={breakdown.budgetCompatibility || 0} max={20} />
                <ProgressBar label="Lifestyle & Habits" value={breakdown.lifestyleHabits || 0} max={35} />
                <ProgressBar label="Housing Prefs" value={breakdown.housingPreference || 0} max={10} />
                <ProgressBar label="Soft Habits" value={breakdown.softHabits || 0} max={5} />
              </div>
              {user.isBasicProfile && (
                <p className="text-xs text-slate-400 mt-6 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                  Scores are estimated. Complete your profile for accurate matching.
                </p>
              )}
            </div>

            {/* Quick Facts */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <h2 className="text-xl font-bold">Quick Facts</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-[#f15a14] flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.university || "University Unlisted"}</p>
                    <p className="text-xs text-slate-500">{user.academicYear || "Year Unlisted"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {user.budgetRange ? `$${user.budgetRange.min} - $${user.budgetRange.max}` : "Budget Unlisted"}
                    </p>
                    <p className="text-xs text-slate-500">Monthly Budget</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize">{user.roomType || "Any Room Type"}</p>
                    <p className="text-xs text-slate-500">Preference</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.leaseDuration || "Flexible"}</p>
                    <p className="text-xs text-slate-500">Lease Duration</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
