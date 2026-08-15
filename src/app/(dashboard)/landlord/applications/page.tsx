// "use client";

// import { useEffect, useState } from "react";
// import { UserCheck, Mail, Calendar, Home, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "react-toastify";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// interface Application {
//   _id: string;
//   flatId: {
//     _id: string;
//     title: string;
//   };
//   studentId: {
//     _id: string;
//     name: string;
//     email: string;
//     image?: string;
//   };
//   message?: string;
//   moveInDate?: string;
//   status: "pending" | "accepted" | "denied";
//   createdAt: string;
// }

// export default function ManageApplications() {
//   const { data: session, isPending: sessionPending } = authClient.useSession();
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Retrieve token
//   const getToken = () => {
//     if (typeof window === "undefined") return "";
//     let token = document.cookie
//       .split("; ")
//       .find((row) => row.startsWith("better-auth.session_token="))
//       ?.split("=")[1] || "";
    
//     if (!token) {
//       for (let i = 0; i < localStorage.length; i++) {
//         const key = localStorage.key(i);
//         if (key && key.includes("session_token")) {
//           token = localStorage.getItem(key) || "";
//           break;
//         }
//       }
//     }
//     return token;
//   };

//   const fetchApplications = async () => {
//     if (sessionPending || !session?.user) return;
//     setLoading(true);
//     try {
//       const token = getToken();
//       const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
//       const response = await fetch(`${baseUrl}/api/v1/landlord/applications`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const result = await response.json();
//       if (result.success) {
//         setApplications(result.data);
//       } else {
//         toast.error(result.message || "Failed to load applications");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error loading applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, [session, sessionPending]);

//   // Update status of application
//   const handleUpdateStatus = async (id: string, newStatus: "accepted" | "denied") => {
//     try {
//       const token = getToken();
//       const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
//       const response = await fetch(`${baseUrl}/api/v1/landlord/applications/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({ status: newStatus })
//       });
//       const result = await response.json();
//       if (result.success) {
//         toast.success(`Proposal ${newStatus} successfully`);
//         setApplications(applications.map(app => app._id === id ? { ...app, status: newStatus } : app));
//       } else {
//         toast.error(result.message || "Failed to update proposal status");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Network error updating status");
//     }
//   };

//   if (loading || sessionPending) {
//     return (
//       <div className="space-y-6 animate-pulse">
//         <div>
//           <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
//           <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="bg-white border border-gray-150 rounded-3xl p-6 h-56"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8 animate-fade-in pb-16">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Tenant Applications</h1>
//         <p className="text-xs text-gray-400 mt-1">Review student tenant requests, desired move-in dates, and accept/deny proposals.</p>
//       </div>

//       {/* Applications Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//         {applications.length > 0 ? (
//           applications.map((app) => (
//             <div key={app._id} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              
//               {/* Card Header: Student profile */}
//               <div>
//                 <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-50">
//                   <div className="flex items-center gap-3">
//                     <Avatar className="w-10 h-10 border border-gray-150 shrink-0">
//                       <AvatarImage src={app.studentId?.image} alt={app.studentId?.name} />
//                       <AvatarFallback className="bg-slate-100 text-slate-400 font-bold text-xs">
//                         {app.studentId?.name?.charAt(0).toUpperCase() || "ST"}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="text-xs font-bold text-gray-950">{app.studentId?.name || "Student Tenant"}</h3>
//                       <p className="text-[10px] text-gray-400 font-medium">{app.studentId?.email}</p>
//                     </div>
//                   </div>
//                   <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
//                     app.status === "accepted"
//                       ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
//                       : app.status === "denied"
//                       ? "bg-rose-50 text-rose-700 border border-rose-100"
//                       : "bg-amber-50 text-amber-700 border border-amber-100"
//                   }`}>
//                     {app.status === "accepted" && <CheckCircle2 className="w-3 h-3" />}
//                     {app.status === "denied" && <XCircle className="w-3 h-3" />}
//                     {app.status === "pending" && <AlertCircle className="w-3 h-3 animate-pulse" />}
//                     {app.status}
//                   </span>
//                 </div>

//                 {/* Flat & Move In details */}
//                 <div className="py-4 space-y-2.5 text-xs text-gray-600 font-medium">
//                   <div className="flex items-center gap-2">
//                     <Home className="w-4 h-4 text-[#f15a14] shrink-0" />
//                     <span>Target Property: <span className="text-gray-950 font-bold">{app.flatId?.title || "Deleted flat"}</span></span>
//                   </div>
//                   {app.moveInDate && (
//                     <div className="flex items-center gap-2">
//                       <Calendar className="w-4 h-4 text-[#f15a14] shrink-0" />
//                       <span>Desired Move-in: <span className="text-gray-950 font-bold">{new Date(app.moveInDate).toLocaleDateString("en-US", { dateStyle: "medium" })}</span></span>
//                     </div>
//                   )}
//                   {app.message && (
//                     <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl flex gap-2">
//                       <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
//                       <p className="text-[10px] leading-relaxed text-gray-600 font-normal italic">
//                         &quot;{app.message}&quot;
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Actions Footer */}
//               <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-3">
//                 <a href={`mailto:${app.studentId?.email}?subject=Regarding your application for ${app.flatId?.title}`} className="flex-1">
//                   <Button variant="outline" className="w-full rounded-xl text-xs h-9 font-bold flex items-center justify-center gap-1.5 border-gray-150 hover:bg-gray-50">
//                     <Mail className="w-3.5 h-3.5" /> Contact
//                   </Button>
//                 </a>
                
//                 {app.status === "pending" && (
//                   <>
//                     <Button 
//                       onClick={() => handleUpdateStatus(app._id, "denied")}
//                       variant="ghost" 
//                       className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs h-9 font-bold px-3"
//                     >
//                       Deny
//                     </Button>
//                     <Button 
//                       onClick={() => handleUpdateStatus(app._id, "accepted")}
//                       className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs h-9 font-bold px-4"
//                     >
//                       Accept
//                     </Button>
//                   </>
//                 )}
//               </div>

//             </div>
//           ))
//         ) : (
//           <div className="col-span-full bg-white border border-gray-150 rounded-3xl py-16 text-center shadow-sm">
//             <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//             <h3 className="text-sm font-bold text-gray-900">No applications received</h3>
//             <p className="text-xs text-gray-400 mt-1">Student tenant requests for your listed flats will appear here.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { UserCheck, Mail, Calendar, Home, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { publicFetch, serverMutation } from "@/lib/core/server"; 
import { getUserSession } from "@/lib/core/session";

interface Application {
  _id: string;
  flatId: {
    _id: string;
    title: string;
  };
  studentId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  message?: string;
  moveInDate?: string;
  status: "pending" | "accepted" | "denied";
  createdAt: string;
}

export default function ManageApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async (currentLandlordId: string) => {
    setLoading(true);
    try {
      const result = await publicFetch(`/api/v1/landlord/applications/${currentLandlordId}`);
      if (result.success) {
        setApplications(result.data);
      } else {
        toast.error(result.message || "Failed to load applications");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error loading applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getUserSession();
        if (user?.id) {
          fetchApplications(user.id);
        } else {
          setLoading(false);
          toast.error("Landlord session not found. Please log in.");
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    init();
  }, []);

  // Update status using serverMutation
  const handleUpdateStatus = async (id: string, newStatus: "accepted" | "denied") => {
    try {
      const result = await serverMutation(
        `/api/v1/landlord/applications/${id}`,
        { status: newStatus },
        "PATCH"
      );
      if (result.success) {
        toast.success(`Proposal ${newStatus} successfully`);
        setApplications(applications.map(app => app._id === id ? { ...app, status: newStatus } : app));
      } else {
        toast.error(result.message || "Failed to update proposal status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error updating status");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-150 rounded-3xl p-6 h-56"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Tenant Applications</h1>
        <p className="text-xs text-gray-400 mt-1">Review student tenant requests, desired move-in dates, and accept/deny proposals.</p>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app._id} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
              
              {/* Card Header: Student profile */}
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-gray-150 shrink-0">
                      <AvatarImage src={app.studentId?.image} alt={app.studentId?.name} />
                      <AvatarFallback className="bg-slate-100 text-slate-400 font-bold text-xs">
                        {app.studentId?.name?.charAt(0).toUpperCase() || "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xs font-bold text-gray-950">{app.studentId?.name || "Student Tenant"}</h3>
                      <p className="text-[10px] text-gray-400 font-medium">{app.studentId?.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                    app.status === "accepted"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : app.status === "denied"
                      ? "bg-rose-50 text-rose-700 border border-rose-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {app.status === "accepted" && <CheckCircle2 className="w-3 h-3" />}
                    {app.status === "denied" && <XCircle className="w-3 h-3" />}
                    {app.status === "pending" && <AlertCircle className="w-3 h-3 animate-pulse" />}
                    {app.status}
                  </span>
                </div>

                {/* Flat & Move In details */}
                <div className="py-4 space-y-2.5 text-xs text-gray-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-[#f15a14] shrink-0" />
                    <span>Target Property: <span className="text-gray-950 font-bold">{app.flatId?.title || "Deleted flat"}</span></span>
                  </div>
                  {app.moveInDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#f15a14] shrink-0" />
                      <span>Desired Move-in: <span className="text-gray-950 font-bold">{new Date(app.moveInDate).toLocaleDateString("en-US", { dateStyle: "medium" })}</span></span>
                    </div>
                  )}
                  {app.message && (
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-2xl flex gap-2">
                      <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed text-gray-600 font-normal italic">
                        &quot;{app.message}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-3">
                <a href={`mailto:${app.studentId?.email}?subject=Regarding your application for ${app.flatId?.title}`} className="flex-1">
                  <Button variant="outline" className="w-full rounded-xl text-xs h-9 font-bold flex items-center justify-center gap-1.5 border-gray-150 hover:bg-gray-50">
                    <Mail className="w-3.5 h-3.5" /> Contact
                  </Button>
                </a>
                
                {app.status === "pending" && (
                  <>
                    <Button 
                      onClick={() => handleUpdateStatus(app._id, "denied")}
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs h-9 font-bold px-3"
                    >
                      Deny
                    </Button>
                    <Button 
                      onClick={() => handleUpdateStatus(app._id, "accepted")}
                      className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold px-4"
                    >
                      Accept
                    </Button>
                  </>
                )}
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-gray-150 rounded-3xl py-16 text-center shadow-sm">
            <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900">No applications received</h3>
            <p className="text-xs text-gray-400 mt-1">Student tenant requests for your listed flats will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}