"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Building2,
  Users, 
  Check, 
  Loader2, 
  Clock, 
  MapPin, 
  UserCheck, 
  AlertCircle 
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { publicFetch, serverMutation } from "@/lib/core/server";
import { toast } from "react-toastify";
import Image from "next/image";

interface FlatApplication {
  _id: string;
  flatId: string;
  applicantType: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  flatDetails?: {
    title: string;
    price: number;
    location: string;
    image: string;
    type: string;
  };
}

interface GroupRequest {
  _id: string;
  groupId: string;
  message?: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: string;
  groupDetails?: {
    name: string;
    groupGenderType: string;
    description: string;
  };
}

interface GroupInvitation {
  _id: string;
  groupId: string;
  message?: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  createdAt: string;
  groupDetails?: {
    name: string;
    groupGenderType: string;
    description: string;
  };
}

export default function MyApplicationsPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [flatApps, setFlatApps] = useState<FlatApplication[]>([]);
  const [groupReqs, setGroupReqs] = useState<GroupRequest[]>([]);
  const [groupInvites, setGroupInvites] = useState<GroupInvitation[]>([]);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const fetchApplicationsData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await publicFetch(`/api/applications/renter/${user.id}`);
      if (res && res.success && res.data) {
        setFlatApps(res.data.flatApplications || []);
        setGroupReqs(res.data.sentGroupRequests || []);
        setGroupInvites(res.data.receivedGroupInvitations || []);
      }
    } catch (err) {
      console.error("Failed to fetch applications data", err);
      toast.error("Could not load your applications and requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchApplicationsData();
    }
  }, [user?.id]);

  const handleRespondInvitation = async (inviteId: string, action: "accepted" | "declined") => {
    if (!user?.id) return;
    setRespondingId(inviteId);
    try {
      const res = await serverMutation(
        `/api/request-invitations/${inviteId}/status`,
        { action },
        "PATCH"
      );
      if (res && res.success) {
        toast.success(`Group invitation ${action} successfully!`);
        fetchApplicationsData();
      } else {
        toast.error(res?.message || `Failed to ${action} invitation`);
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setRespondingId(null);
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!user?.id) return;
    try {
      const res = await serverMutation(
        `/api/request-invitations/${requestId}/status`,
        { action: "cancelled" },
        "PATCH"
      );
      if (res && res.success) {
        toast.success("Request cancelled successfully!");
        fetchApplicationsData();
      } else {
        toast.error(res?.message || "Failed to cancel request");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-[#f15a14]" />
        <p className="text-sm font-semibold text-gray-500">Syncing your applications...</p>
      </div>
    );
  }

  console.log(flatApps)

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-16">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#f15a14]" /> My Applications
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Track the status of your home rental applications, group requests, and pending roommate group invites.
        </p>
      </div>

      {/* Grid of applications */}
      <div className="space-y-8">
        
        {/* Section 1: Rent applications */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2.5 pb-3 border-b border-gray-50">
            <Building2 className="w-5 h-5 text-[#f15a14]" /> Housing Rent Applications ({flatApps.length})
          </h2>
          {flatApps.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-50 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-medium">Flat details</th>
                    <th className="pb-3 font-medium">Applicant Type</th>
                    <th className="pb-3 font-medium">Applied Date</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                    <th className="pb-3 font-medium text-right">Rent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {flatApps.map((app) => (
                    <tr key={app._id} className="text-gray-900 font-medium">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {app.flatDetails?.image && (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                              <Image 
                                src={app.flatDetails.image} 
                                alt={app.flatDetails.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-gray-950">{app.flatDetails?.title || "Unknown Flat"}</h4>
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" /> {app.flatDetails?.location || "No Location"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 capitalize font-semibold text-gray-500">
                        {app.applicantType.replace("_", " ")}
                      </td>
                      <td className="py-4 text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : app.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {app.status === "approved" && <UserCheck className="w-3.5 h-3.5" />}
                          {app.status === "rejected" && <AlertCircle className="w-3.5 h-3.5" />}
                          {app.status === "pending" && <Clock className="w-3.5 h-3.5" />}
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 text-right font-black text-gray-950">
                        ৳{app.flatDetails?.price?.toLocaleString() || "N/A"}/mo
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-4">You have not submitted any housing applications yet.</p>
          )}
        </div>

        {/* Section 2: Roommate Group Invitations Received */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2.5 pb-3 border-b border-gray-50">
            <Users className="w-5 h-5 text-[#f15a14]" /> Group Invitations Received ({groupInvites.length})
          </h2>
          {groupInvites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupInvites.map((invite) => (
                <div key={invite._id} className="border border-gray-100 rounded-2xl p-5 space-y-4 hover:border-gray-200 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-wider bg-orange-50 text-[#f15a14] px-2 py-0.5 rounded">
                        {invite.groupDetails?.groupGenderType} only Group
                      </span>
                      <h3 className="font-bold text-sm text-gray-950">{invite.groupDetails?.name || "Unknown Group"}</h3>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      invite.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700"
                        : invite.status === "declined"
                        ? "bg-rose-50 text-rose-700"
                        : invite.status === "cancelled"
                        ? "bg-gray-50 text-gray-500"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {invite.status}
                    </span>
                  </div>

                  {invite.message && (
                    <div className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-3 italic leading-normal">
                      "{invite.message}"
                    </div>
                  )}

                  {invite.status === "pending" && (
                    <div className="flex gap-2.5 justify-end pt-2">
                      <button
                        onClick={() => handleRespondInvitation(invite._id, "declined")}
                        disabled={respondingId !== null}
                        className="px-4 py-2 text-xs font-bold border border-red-150 hover:bg-red-50 text-red-600 rounded-xl transition-all"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleRespondInvitation(invite._id, "accepted")}
                        disabled={respondingId !== null}
                        className="px-4 py-2 text-xs font-bold bg-[#f15a14] hover:bg-[#d94f10] text-white rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        {respondingId === invite._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-4">No roommate group invitations received.</p>
          )}
        </div>

        {/* Section 3: Roommate Group Requests Sent */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2.5 pb-3 border-b border-gray-50">
            <Users className="w-5 h-5 text-indigo-500" /> Requests to Join Groups ({groupReqs.length})
          </h2>
          {groupReqs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groupReqs.map((req) => (
                <div key={req._id} className="border border-gray-100 rounded-2xl p-5 space-y-3 hover:border-gray-200 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-gray-950">{req.groupDetails?.name || "Unknown Group"}</h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">Applied on: {new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      req.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700"
                        : req.status === "declined"
                        ? "bg-rose-50 text-rose-700"
                        : req.status === "cancelled"
                        ? "bg-gray-50 text-gray-500"
                        : "bg-amber-50 text-amber-700"
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  {req.message && (
                    <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-2.5 italic">
                      My message: "{req.message}"
                    </p>
                  )}

                  {req.status === "pending" && (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => handleCancelRequest(req._id)}
                        className="px-4 py-2 text-xs font-bold border border-gray-250 hover:bg-gray-50 text-gray-600 rounded-xl transition-all"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic py-4">You have not requested to join any roommate groups.</p>
          )}
        </div>

      </div>
    </div>
  );
}
