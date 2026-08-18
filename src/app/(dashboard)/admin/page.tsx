"use client";

import { useEffect, useState } from "react";
import { Users, Building2, Home, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { publicFetch } from "@/lib/core/server";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface GrowthItem {
  month: string;
  users: number;
  properties: number;
  rented: number;
}

interface DistributionItem {
  name: string;
  value: number;
}

interface StatsData {
  totalUsers: number;
  totalProperties: number;
  totalRentedRooms: number;
  growthData: GrowthItem[];
  distribution: DistributionItem[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await publicFetch("/api/admin/stats");
        if (res?.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const COLORS = ["#f15a14", "#10b981", "#ef4444"];

  return (
    <div className="w-full min-h-screen bg-gray-50/30 space-y-10 animate-fade-in font-sans">
      {/* Top Banner Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-950 uppercase">System Core Console</h1>
          <p className="text-sm text-gray-500 mt-1">Platform-wide statistics, growth analysis, and security overview.</p>
        </div>
        <Button className="bg-gray-950 hover:bg-gray-800 text-white rounded-full text-xs font-semibold px-5 h-9 w-fit">
          <ShieldCheck className="w-4 h-4 mr-1.5" /> Security Logs
        </Button>
      </div>

      {/* Admin Operations Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Metric Card: Users */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Users</span>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-[#f15a14] bg-orange-50">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-100" />
            ) : (
              <h3 className="text-3xl font-black text-gray-950 tracking-tight">{stats?.totalUsers}</h3>
            )}
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Registered platform users</p>
          </div>
        </div>

        {/* Metric Card: Properties */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Properties</span>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-blue-600 bg-blue-50">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-100" />
            ) : (
              <h3 className="text-3xl font-black text-gray-950 tracking-tight">{stats?.totalProperties}</h3>
            )}
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Total listings posted</p>
          </div>
        </div>

        {/* Metric Card: Rented Rooms */}
        <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Rented Rooms</span>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-emerald-600 bg-emerald-50">
              <Home className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <Skeleton className="h-8 w-24 bg-gray-100" />
            ) : (
              <h3 className="text-3xl font-black text-gray-950 tracking-tight">{stats?.totalRentedRooms}</h3>
            )}
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Rented/Occupied listings</p>
          </div>
        </div>
      </div>

      {/* Analytics Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Growth Trend Area Chart */}
        <div className="lg:col-span-8 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider">Platform Activity & Growth Trend</h3>
              <p className="text-[10px] text-gray-400 mt-0.5 font-bold">6-Month historical analysis of signups and listing trends</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#f15a14]" />
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl bg-gray-50" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.growthData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f15a14" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f15a14" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProperties" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRented" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      border: "1px solid #e5e7eb",
                      fontSize: "11px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Area name="Users Signups" type="monotone" dataKey="users" stroke="#f15a14" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                  <Area name="Listings Posted" type="monotone" dataKey="properties" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProperties)" />
                  <Area name="Properties Rented" type="monotone" dataKey="rented" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRented)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Listing Status Donut/Pie Chart */}
        <div className="lg:col-span-4 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider">Listing Status Distribution</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 font-bold">Ratio of Available vs. Rented listings</p>
          </div>

          <div className="h-60 w-full flex justify-center items-center">
            {loading ? (
              <Skeleton className="w-40 h-40 rounded-full bg-gray-50" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.distribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {(stats?.distribution || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      border: "1px solid #e5e7eb",
                      fontSize: "11px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconSize={10}
                    formatter={(value) => <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}