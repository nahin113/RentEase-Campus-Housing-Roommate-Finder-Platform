"use client";

import { useEffect, useState } from "react";
import { Search, Calendar, Heart, Users, Home, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { publicFetch } from "@/lib/core/server";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ApplicationItem {
  id: string;
  propertyTitle: string;
  propertyImage: string;
  appliedDate: string;
  status: string;
  rent: number;
  listingType: string;
}

interface DashboardData {
  userName: string;
  hasAcceptedLease: boolean;
  savedFlatsCount: number;
  groupInfo: {
    hasGroup: boolean;
    groupName: string;
    memberCount: number;
  };
  subletStats: {
    totalPosted: number;
    pendingRequestsCount: number;
  };
  recentApplications: ApplicationItem[];
}

export default function RenterPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardSummary() {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        const res = await publicFetch(`/api/renter/dashboard-summary/${session.user.id}`);
        if (res?.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load renter dashboard summary:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!sessionPending) {
      loadDashboardSummary();
    }
  }, [session, sessionPending]);

  if (sessionPending || loading) {
    return (
      <div className="space-y-10 animate-fade-in font-sans">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 bg-gray-150" />
          <Skeleton className="h-4 w-96 bg-gray-150" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded-3xl bg-gray-150" />
          <Skeleton className="h-28 rounded-3xl bg-gray-150" />
          <Skeleton className="h-28 rounded-3xl bg-gray-150" />
        </div>
        <Skeleton className="h-64 rounded-3xl bg-gray-150" />
      </div>
    );
  }

  const userGreeting = data?.userName || session?.user?.name || "Renter";

  return (
    <div className="space-y-10 animate-fade-in font-sans">
      
      {/* Title Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Welcome back, {userGreeting}!</h1>
          <p className="text-xs text-gray-400 mt-1">Here is the active status of your property search network.</p>
        </div>
        <Button 
          onClick={() => router.push("/flats")}
          className="bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-semibold px-5 h-9 w-fit"
        >
          <Search className="w-3.5 h-3.5 mr-2" /> Find New Flats
        </Button>
      </div>

      {/* Horizontal Status Track Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* Next Lease Pay Card (conditionally visible) */}
        {data?.hasAcceptedLease && (
          <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-[#f15a14] shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Next Lease Pay</p>
              <p className="text-sm font-black text-gray-950 mt-0.5">July 01, 2026</p>
            </div>
          </div>
        )}

        {/* Saved Flats Card */}
        <Link 
          href="/renter/saved" 
          className="bg-white border border-gray-150 hover:border-gray-300 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shrink-0 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Saved Flats</p>
            <p className="text-sm font-black text-gray-950 mt-0.5">{data?.savedFlatsCount || 0} Saved</p>
          </div>
        </Link>

        {/* Group Status Card */}
        <Link 
          href="/renter/my-group" 
          className="bg-white border border-gray-150 hover:border-gray-300 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Group Status</p>
            <p className="text-xs font-black text-gray-900 mt-0.5">
              {data?.groupInfo?.hasGroup 
                ? `${data.groupInfo.groupName} (${data.groupInfo.memberCount} members)` 
                : "Solo Bachelor"}
            </p>
          </div>
        </Link>

        {/* My Sublets Status Card */}
        <Link 
          href="/renter/sublet-requests" 
          className="bg-white border border-gray-150 hover:border-gray-300 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">My Sublets</p>
            <p className="text-sm font-black text-gray-950 mt-0.5">{data?.subletStats?.totalPosted || 0} Posted</p>
          </div>
        </Link>

        {/* Incoming Sublet Inquiries Card */}
        <Link 
          href="/renter/sublet-requests" 
          className="bg-white border border-gray-150 hover:border-gray-300 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition-all group"
        >
          <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 group-hover:scale-105 transition-transform">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sublet Inquiries</p>
            <p className="text-sm font-black text-gray-950 mt-0.5">{data?.subletStats?.pendingRequestsCount || 0} Pending</p>
          </div>
        </Link>

      </div>

      {/* Applications Tracking Section */}
      <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-950 mb-4">Submitted Applications Status</h3>
        
        {!data?.recentApplications || data.recentApplications.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <Inbox className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No active housing applications submitted yet.</p>
            <Button
              onClick={() => router.push("/flats")}
              className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-xs font-bold px-6 h-10 shadow-md shadow-orange-500/20"
            >
              Browse Housing
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 font-semibold bg-gray-50/50">
                  <th className="p-4 font-medium uppercase tracking-wider">Residence Asset Name</th>
                  <th className="p-4 font-medium uppercase tracking-wider">Listing Type</th>
                  <th className="p-4 font-medium uppercase tracking-wider">Applied Date</th>
                  <th className="p-4 font-medium uppercase tracking-wider">Review Status</th>
                  <th className="p-4 font-medium uppercase tracking-wider text-right">Rent Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentApplications.map((app) => {
                  let badgeColor = "text-amber-700 bg-amber-50 border-amber-100";
                  if (app.status === "accepted" || app.status === "approved") {
                    badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
                  } else if (app.status === "rejected" || app.status === "denied") {
                    badgeColor = "text-red-700 bg-red-50 border-red-100";
                  }

                  const appliedDateClean = new Date(app.appliedDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  return (
                    <tr key={app.id} className="text-gray-900 font-medium hover:bg-gray-50/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-150 shrink-0">
                            <Image 
                              src={app.propertyImage || "/placeholder.jpg"} 
                              alt={app.propertyTitle} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <span className="font-bold text-gray-950 block truncate max-w-[200px]">{app.propertyTitle}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{app.listingType}</span>
                      </td>
                      <td className="p-4 text-gray-400">{appliedDateClean}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border tracking-wider ${badgeColor}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-gray-950">৳{app.rent?.toLocaleString()}<span className="text-[10px] text-gray-400 font-normal">/mo</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}