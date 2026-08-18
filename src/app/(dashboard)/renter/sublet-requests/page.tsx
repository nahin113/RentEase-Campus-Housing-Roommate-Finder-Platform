"use client";

import { useEffect, useState } from "react";
import { Check, X, Inbox, MessageSquare, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { publicFetch, serverMutation } from "@/lib/core/server";
import { getUserSession } from "@/lib/core/session";
import { toast } from "react-toastify";
import Image from "next/image";

interface RenterApplicant {
  name: string;
  email: string;
  image?: string;
}

interface FlatInfo {
  title: string;
  location: string;
  price: number;
}

interface RequestItem {
  _id: string;
  flatId: FlatInfo;
  studentId: RenterApplicant;
  applicantType: "family" | "single_bachelor" | "group_bachelor";
  message?: string;
  status: "pending" | "accepted" | "denied";
  createdAt: string;
}

export default function SubletRequestsPage() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        const user = await getUserSession();
        if (user?.id) {
          const res = await publicFetch(`/api/sublets/requests/${user.id}`);
          if (res?.success && Array.isArray(res.data)) {
            setRequests(res.data);
          }
        }
      } catch (err) {
        console.error("Failed to load sublet requests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, []);

  const handleUpdateStatus = async (requestId: string, newStatus: "accepted" | "denied") => {
    try {
      const res = await serverMutation(`/api/sublets/requests/status/${requestId}`, { status: newStatus }, "PUT");
      if (res?.success) {
        setRequests((prev) =>
          prev.map((r) => (r._id === requestId ? { ...r, status: newStatus } : r))
        );
        toast.success(`Application request ${newStatus} successfully!`);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30 space-y-10 animate-fade-in font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-950 uppercase">Sublet Requests Inbox</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review incoming applications submitted by students for your posted sublets.
        </p>
      </div>

      {/* Requests list */}
      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full bg-gray-100" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-100" />
                  <Skeleton className="h-3 w-48 bg-gray-100" />
                </div>
              </div>
              <Skeleton className="h-8 w-full rounded-xl bg-gray-100" />
            </div>
          ))
        ) : requests.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm max-w-xl mx-auto">
            <Inbox className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">No Sublet inquiries received yet.</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req._id}
              className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div className="space-y-4 flex-1">
                {/* Header: Applicant info & listing title */}
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-150 border border-gray-100 shrink-0">
                    <Image
                      src={req.studentId?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                      alt={req.studentId?.name || "Applicant"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{req.studentId?.name}</h4>
                      <span className="text-[9px] bg-orange-50 text-[#f15a14] border border-orange-100 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {req.applicantType === "single_bachelor" ? "Single Bachelor" : "Bachelor Group"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{req.studentId?.email}</p>
                  </div>
                </div>

                {/* Sublet flat details */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Property Applied</span>
                    <span className="text-xs font-black text-[#f15a14]">৳{req.flatId?.price?.toLocaleString()}/mo</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-950">{req.flatId?.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#f15a14]" />
                    <span>{req.flatId?.location}</span>
                  </div>
                </div>

                {/* Message */}
                {req.message && (
                  <div className="flex items-start gap-2 bg-blue-50/20 border border-blue-50/50 p-4 rounded-2xl">
                    <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 leading-relaxed italic">"{req.message}"</p>
                  </div>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col items-end justify-between shrink-0 gap-4 self-stretch">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block text-right">Application Status</span>
                  <span
                    className={`inline-block mt-1 text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      req.status === "pending"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : req.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-red-50 text-red-700 border-red-100"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {req.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleUpdateStatus(req._id, "denied")}
                      variant="outline"
                      className="rounded-full text-[10px] font-bold uppercase tracking-wider h-9 px-4 border-gray-200 hover:bg-gray-50 text-gray-500"
                    >
                      <X className="w-3.5 h-3.5 mr-1" /> Deny
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus(req._id, "accepted")}
                      className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-[10px] font-bold uppercase tracking-wider h-9 px-4 shadow-md shadow-orange-500/10"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Accept
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
