"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { publicFetch } from "@/lib/core/server";
import { Search, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserSession } from "@/lib/core/session";

export default function RoommatesPage() {
  const [roommates, setRoommates] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const user = await getUserSession()
        console.log(user)
        const res = await publicFetch(`/api/roommates/${user?.id}`);
        console.log(res)
        const data = res?.data || res;
        if (Array.isArray(data)) {
          setRoommates(data);
          setFiltered(data);
        }
      } catch (err) {
        console.error("Failed to load roommates", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = roommates;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.name?.toLowerCase().includes(q) || 
        r.university?.toLowerCase().includes(q) ||
        r.preferredNeighborhoods?.some((n: string) => n.toLowerCase().includes(q))
      );
    }
    if (budgetFilter) {
      result = result.filter(r => {
        if (!r.budgetRange) return false;
        const max = r.budgetRange.max;
        if (budgetFilter === "low") return max <= 1000;
        if (budgetFilter === "med") return max > 1000 && max <= 2000;
        if (budgetFilter === "high") return max > 2000;
        return true;
      });
    }
    if (roomTypeFilter) {
      result = result.filter(r => r.roomType === roomTypeFilter);
    }
    setFiltered(result);
  }, [search, budgetFilter, roomTypeFilter, roommates]);

  const getScoreColor = (score: number) => {
    if (score > 80) return "text-green-500";
    if (score >= 50) return "text-[#f15a14]";
    return "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white py-30 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Find Your Ideal Roommate</h1>
          <p className="text-slate-500 dark:text-slate-400">Match based on lifestyle, budget, and location preferences.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, university, or location..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#f15a14]"
            />
          </div>
          <select 
            value={budgetFilter} 
            onChange={(e) => setBudgetFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#f15a14]"
          >
            <option value="">All Budgets</option>
            <option value="low">Under $1,000</option>
            <option value="med">$1,000 - $2,000</option>
            <option value="high">Over $2,000</option>
          </select>
          <select 
            value={roomTypeFilter} 
            onChange={(e) => setRoomTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-[#f15a14]"
          >
            <option value="">All Room Types</option>
            <option value="private">Private Room</option>
            <option value="shared">Shared Room</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading matches...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(user => (
              <div key={user._id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <Avatar className="w-16 h-16 text-xl font-bold">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-500">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {user.name || "Anonymous User"}
                        {user.profileCompleted && <span className="w-2 h-2 rounded-full bg-green-500" title="Active"></span>}
                      </h3>
                      {user.university && (
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <GraduationCap className="w-4 h-4" /> {user.university}
                        </p>
                      )}
                      {user.department && (
                        <p className="text-xs text-slate-400 mt-0.5">{user.department}</p>
                      )}
                    </div>
                  </div>
                  {/* Match Score Ring */}
                {/* Match Score Ring */}
<div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
  <svg className="w-full h-full transform -rotate-90">
    <circle 
      cx="50%" 
      cy="50%" 
      r="45%" 
      stroke="currentColor" 
      strokeWidth="4" 
      fill="transparent" 
      className="text-slate-100 dark:bg-slate-800" 
    />
    <circle 
      cx="50%" 
      cy="50%" 
      r="45%" 
      stroke="currentColor" 
      strokeWidth="4" 
      fill="transparent" 
      strokeDasharray={`${2 * Math.PI * 45}%`}
      strokeDashoffset={`${2 * Math.PI * 45 * (1 - (user.matchScore || 0) / 100)}%`}
      className={getScoreColor(user.matchScore || 0)} 
      strokeLinecap="round" 
    />
  </svg>
  <span className="absolute text-xs font-bold">{user.matchScore || 0}%</span>
</div>
                </div>

                <div className="mt-2 flex flex-wrap gap-2 mb-6">
                  {user.academicYear && (
                    <span className="px-2.5 py-1 text-xs font-medium bg-[#f15a14]/10 text-[#f15a14] rounded-full">
                      {user.academicYear}
                    </span>
                  )}
                  {user.habits?.slice(0, 3).map((habit: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 rounded-full">
                      {habit}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link href={`/roommates/${user._id}`} className="flex-1 text-center py-2 px-4 rounded-full text-white border border-slate-200 dark:border-slate-700 bg-[#f15a14] hover:bg-slate-50 hover:text-black dark:hover:bg-slate-800 transition-colors text-sm font-medium">
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No roommates found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
