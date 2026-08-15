// "use client";

// import { useEffect, useState } from "react";
// import { Building, Users, DollarSign, FileText, ArrowUpRight, BarChart3, PieChart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { authClient } from "@/lib/auth-client";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import {
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart as RechartsPieChart,
//   Pie,
//   Cell,
//   Legend,
//   Area,
//   ComposedChart
// } from "recharts";

// interface StatsData {
//   totalProperties: number;
//   rentedProperties: number;
//   activeApplications: number;
//   estimatedRevenue: number;
//   monthlyViews: Array<{ month: string; views: number; inquiries: number }>;
//   occupancyTrend: Array<{ name: string; value: number }>;
// }

// const COLORS = ["#f15a14", "#cbd5e1"];

// export default function LandlordDashboard() {
//   const { data: session, isPending: sessionPending } = authClient.useSession();
//   const [stats, setStats] = useState<StatsData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchStats() {
//       if (sessionPending || !session?.user) return;

//       try {
//         // Retrieve session token from cookie/localStorage helper
//         let token = "";
//         if (typeof window !== "undefined") {
//           token = document.cookie
//             .split("; ")
//             .find((row) => row.startsWith("better-auth.session_token="))
//             ?.split("=")[1] || "";
          
//           if (!token) {
//             for (let i = 0; i < localStorage.length; i++) {
//               const key = localStorage.key(i);
//               if (key && key.includes("session_token")) {
//                 token = localStorage.getItem(key) || "";
//                 break;
//               }
//             }
//           }
//         }

//         const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
//         const response = await fetch(`${baseUrl}/api/v1/landlord/stats`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           }
//         });

//         const result = await response.json();
//         if (result.success) {
//           setStats(result.data);
//         } else {
//           toast.error(result.message || "Failed to load dashboard metrics");
//         }
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//         toast.error("Network error fetching metrics");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchStats();
//   }, [session, sessionPending]);

//   if (loading || sessionPending) {
//     return (
//       <div className="space-y-10 animate-pulse">
//         <div>
//           <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
//           <div className="h-4 w-48 bg-gray-200 rounded-lg mt-2"></div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-32">
//               <div className="flex justify-between">
//                 <div className="h-3 w-24 bg-gray-200 rounded"></div>
//                 <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
//               </div>
//               <div className="h-8 w-16 bg-gray-200 rounded mt-4"></div>
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-80"></div>
//           <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-80"></div>
//         </div>
//       </div>
//     );
//   }

//   const defaultStats: StatsData = stats || {
//     totalProperties: 0,
//     rentedProperties: 0,
//     activeApplications: 0,
//     estimatedRevenue: 0,
//     monthlyViews: [],
//     occupancyTrend: []
//   };

//   const metricCards = [
//     {
//       label: "Total Listed Properties",
//       value: `${defaultStats.totalProperties} Units`,
//       sub: "Active listings on board",
//       icon: Building,
//       color: "text-blue-600 bg-blue-50"
//     },
//     {
//       label: "Rented Units",
//       value: `${defaultStats.rentedProperties} Rented`,
//       sub: `${defaultStats.totalProperties - defaultStats.rentedProperties} units vacant`,
//       icon: Users,
//       color: "text-emerald-600 bg-emerald-50"
//     },
//     {
//       label: "Estimated Revenue",
//       value: `$${defaultStats.estimatedRevenue.toLocaleString()}`,
//       sub: "Based on active leases",
//       icon: DollarSign,
//       color: "text-[#f15a14] bg-orange-50"
//     },
//     {
//       label: "Pending Applications",
//       value: `${defaultStats.activeApplications} Requests`,
//       sub: "Needs landlord review",
//       icon: FileText,
//       color: "text-amber-600 bg-amber-50"
//     }
//   ];

//   return (
//     <div className="space-y-10 animate-fade-in pb-16">
//       {/* Title Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">
//             Welcome Back, {session?.user?.name || "Landlord"}
//           </h1>
//           <p className="text-xs text-gray-400 mt-1">
//             Real-time analytics for your rental flat portfolios and student requests.
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Link href="/landlord/add-property">
//             <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-xs font-extrabold h-10 px-5 shadow-md shadow-orange-500/20">
//               List New Flat
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Metrics Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {metricCards.map((card, i) => (
//           <div key={i} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
//             <div className="flex justify-between items-start">
//               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${card.color}`}>
//                 <card.icon className="w-4 h-4" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <h3 className="text-2xl font-black text-gray-950 tracking-tight">{card.value}</h3>
//               <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Visualizations and Graphs split */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* Main Chart: Composed Bar & Line views */}
//         <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
//                 <BarChart3 className="w-4 h-4 text-[#f15a14]" /> Property Engagement Metrics
//               </h3>
//               <p className="text-[10px] text-gray-400">Monthly page views vs lead inquiries</p>
//             </div>
//           </div>
//           <div className="h-72 w-full">
//             {defaultStats.monthlyViews.length > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <ComposedChart data={defaultStats.monthlyViews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                   <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
//                   <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
//                   <Tooltip 
//                     contentStyle={{ 
//                       backgroundColor: "#0f172a", 
//                       borderRadius: "16px", 
//                       color: "#fff", 
//                       fontSize: "11px",
//                       border: "none"
//                     }} 
//                   />
//                   <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
//                   <Bar dataKey="views" fill="#f15a14" radius={[6, 6, 0, 0]} name="Page Views" barSize={30} />
//                   <Area type="monotone" dataKey="inquiries" fill="#ffedd5" stroke="#f97316" strokeWidth={2} name="Student Inquiries" />
//                 </ComposedChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">No engagement data available yet.</div>
//             )}
//           </div>
//         </div>

//         {/* Pie Chart: Occupancy Breakdown */}
//         <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
//           <div>
//             <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 mb-1">
//               <PieChart className="w-4 h-4 text-[#f15a14]" /> Portfolio Occupancy Status
//             </h3>
//             <p className="text-[10px] text-gray-400">Available vs Rented flats breakdown</p>
//           </div>
//           <div className="h-56 w-full flex items-center justify-center relative">
//             {defaultStats.totalProperties > 0 ? (
//               <ResponsiveContainer width="100%" height="100%">
//                 <RechartsPieChart>
//                   <Pie
//                     data={defaultStats.occupancyTrend}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     paddingAngle={4}
//                     dataKey="value"
//                   >
//                     {defaultStats.occupancyTrend.map((_, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </RechartsPieChart>
//               </ResponsiveContainer>
//             ) : (
//               <div className="text-xs text-gray-400 italic">No property data.</div>
//             )}
//             {defaultStats.totalProperties > 0 && (
//               <div className="absolute flex flex-col items-center justify-center">
//                 <span className="text-2xl font-black text-gray-950">
//                   {Math.round((defaultStats.rentedProperties / defaultStats.totalProperties) * 100) || 0}%
//                 </span>
//                 <span className="text-[9px] uppercase font-bold text-gray-400">Occupancy</span>
//               </div>
//             )}
//           </div>
//           <div className="flex justify-center gap-6 text-[10px] font-bold text-gray-500">
//             <div className="flex items-center gap-1.5">
//               <div className="w-2.5 h-2.5 rounded-full bg-[#f15a14]" />
//               <span>Rented ({defaultStats.rentedProperties})</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
//               <span>Available ({defaultStats.totalProperties - defaultStats.rentedProperties})</span>
//             </div>
//           </div>
//         </div>

//       </div>

//       {/* Promos & Management Shortcuts */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-[#f15a14] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
//           <div>
//             <span className="text-[9px] font-extrabold tracking-widest text-orange-200 uppercase">Quick Actions</span>
//             <h3 className="text-xl font-bold tracking-tight mt-2 leading-snug">
//               Access requests and modify active student co-living listings in seconds.
//             </h3>
//           </div>
//           <div className="flex flex-wrap gap-3 mt-4">
//             <Link href="/landlord/properties">
//               <Button className="bg-white text-gray-950 hover:bg-gray-50 rounded-xl text-xs font-bold px-4 py-2">
//                 Manage Portfolio
//               </Button>
//             </Link>
//             <Link href="/landlord/applications">
//               <Button className="bg-black/30 hover:bg-black/40 text-white rounded-xl text-xs font-bold px-4 py-2 border border-white/20">
//                 View Applications ({defaultStats.activeApplications})
//               </Button>
//             </Link>
//           </div>
//         </div>

//         <div className="bg-black text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[160px]">
//           <div>
//             <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Premium Boost</span>
//             <h3 className="text-lg font-normal tracking-tight mt-2 leading-snug">
//               Boost your listing views using our roommate match algorithms.
//             </h3>
//           </div>
//           <Button className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-10 transition-colors">
//             Promote Listings <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Building, Users, DollarSign, FileText, ArrowUpRight, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Area,
  ComposedChart
} from "recharts";

import { publicFetch } from "@/lib/core/server";

interface StatsData {
  totalProperties: number;
  rentedProperties: number;
  activeApplications: number;
  estimatedRevenue: number;
  monthlyViews: Array<{ month: string; views: number; inquiries: number }>;
  occupancyTrend: Array<{ name: string; value: number }>;
}

const COLORS = ["#f15a14", "#cbd5e1"];

export default function LandlordDashboard() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (sessionPending || !session?.user) return;

      try {
        const result = await publicFetch(`/api/v1/landlord/stats/${session.user.id}`);
        if (result.success) {
          setStats(result.data);
        } else {
          toast.error(result.message || "Failed to load dashboard metrics");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Network error fetching metrics");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [session, sessionPending]);

  if (loading || sessionPending) {
    return (
      <div className="space-y-10 animate-pulse">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-lg mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-32">
              <div className="flex justify-between">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-7 w-7 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded mt-4"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-80"></div>
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm h-80"></div>
        </div>
      </div>
    );
  }

  const defaultStats: StatsData = stats || {
    totalProperties: 0,
    rentedProperties: 0,
    activeApplications: 0,
    estimatedRevenue: 0,
    monthlyViews: [],
    occupancyTrend: []
  };

  const metricCards = [
    {
      label: "Total Listed Properties",
      value: `${defaultStats.totalProperties} Units`,
      sub: "Active listings on board",
      icon: Building,
      color: "text-blue-600 bg-blue-50"
    },
    {
      label: "Rented Units",
      value: `${defaultStats.rentedProperties} Rented`,
      sub: `${defaultStats.totalProperties - defaultStats.rentedProperties} units vacant`,
      icon: Users,
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      label: "Estimated Revenue",
      value: `$${defaultStats.estimatedRevenue.toLocaleString()}`,
      sub: "Based on active leases",
      icon: DollarSign,
      color: "text-[#f15a14] bg-orange-50"
    },
    {
      label: "Pending Applications",
      value: `${defaultStats.activeApplications} Requests`,
      sub: "Needs landlord review",
      icon: FileText,
      color: "text-amber-600 bg-amber-50"
    }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">
            Welcome Back, {session?.user?.name || "Landlord"}
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time analytics for your rental flat portfolios and student requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/landlord/add-property">
            <Button className="bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-full text-xs font-extrabold h-10 px-5 shadow-md shadow-orange-500/20">
              List New Flat
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, i) => (
          <div key={i} className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{card.label}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-gray-950 tracking-tight">{card.value}</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visualizations and Graphs split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart: Composed Bar & Line views */}
        <div className="lg:col-span-2 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#f15a14]" /> Property Engagement Metrics
              </h3>
              <p className="text-[10px] text-gray-400">Monthly page views vs lead inquiries</p>
            </div>
          </div>
          <div className="h-72 w-full">
            {defaultStats.monthlyViews.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={defaultStats.monthlyViews} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      borderRadius: "16px", 
                      color: "#fff", 
                      fontSize: "11px",
                      border: "none"
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar dataKey="views" fill="#f15a14" radius={[6, 6, 0, 0]} name="Page Views" barSize={30} />
                  <Area type="monotone" dataKey="inquiries" fill="#ffedd5" stroke="#f97316" strokeWidth={2} name="Student Inquiries" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-gray-400 italic">No engagement data available yet.</div>
            )}
          </div>
        </div>

        {/* Pie Chart: Occupancy Breakdown */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-[#f15a14]" /> Portfolio Occupancy Status
            </h3>
            <p className="text-[10px] text-gray-400">Available vs Rented flats breakdown</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center relative">
            {defaultStats.totalProperties > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={defaultStats.occupancyTrend}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {defaultStats.occupancyTrend.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-gray-400 italic">No property data.</div>
            )}
            {defaultStats.totalProperties > 0 && (
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-950">
                  {Math.round((defaultStats.rentedProperties / defaultStats.totalProperties) * 100) || 0}%
                </span>
                <span className="text-[9px] uppercase font-bold text-gray-400">Occupancy</span>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-6 text-[10px] font-bold text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f15a14]" />
              <span>Rented ({defaultStats.rentedProperties})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Available ({defaultStats.totalProperties - defaultStats.rentedProperties})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Promos & Management Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#f15a14] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div>
            <span className="text-[9px] font-extrabold tracking-widest text-orange-200 uppercase">Quick Actions</span>
            <h3 className="text-xl font-bold tracking-tight mt-2 leading-snug">
              Access requests and modify active student co-living listings in seconds.
            </h3>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/landlord/properties">
              <Button className="bg-white text-gray-950 hover:bg-gray-50 rounded-xl text-xs font-bold px-4 py-2">
                Manage Portfolio
              </Button>
            </Link>
            <Link href="/landlord/applications">
              <Button className="bg-black/30 hover:bg-black/40 text-white rounded-xl text-xs font-bold px-4 py-2 border border-white/20">
                View Applications ({defaultStats.activeApplications})
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-black text-white rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[160px]">
          <div>
            <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">Premium Boost</span>
            <h3 className="text-lg font-normal tracking-tight mt-2 leading-snug">
              Boost your listing views using our roommate match algorithms.
            </h3>
          </div>
          <Button className="w-full bg-[#f15a14] hover:bg-[#d6480a] text-white rounded-xl text-xs font-bold h-10 transition-colors">
            Promote Listings <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}