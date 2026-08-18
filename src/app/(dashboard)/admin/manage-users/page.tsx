"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, UserCheck, ShieldAlert, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { publicFetch, serverMutation } from "@/lib/core/server";

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "moderator";
  accountType: "renter" | "landlord" | "professional" | "other";
  banned: boolean;
  isBlocked: boolean;
  createdAt: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await publicFetch("/api/admin/users");
        if (res?.success && Array.isArray(res.data)) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await serverMutation(`/api/admin/users/toggle-block/${userId}`, {}, "PUT");
      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? { ...u, isBlocked: !u.isBlocked, banned: !u.banned }
              : u
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle block:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/30 space-y-10 animate-fade-in font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gray-950 uppercase">Manage Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor user accounts, search registrations, and restrict/block violating users.
        </p>
      </div>

      {/* Control Actions / Search bar */}
      <div className="flex items-center gap-4 bg-white border border-gray-150 p-4 rounded-3xl shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-150 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#f15a14] transition-all"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-150 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">System Role</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx}>
                    <td className="p-5"><Skeleton className="h-4 w-32 bg-gray-100" /></td>
                    <td className="p-5"><Skeleton className="h-4 w-48 bg-gray-100" /></td>
                    <td className="p-5"><Skeleton className="h-4 w-20 bg-gray-100" /></td>
                    <td className="p-5"><Skeleton className="h-5 w-16 rounded-full bg-gray-100" /></td>
                    <td className="p-5 text-right"><Skeleton className="h-8 w-24 rounded-full bg-gray-100 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-xs font-bold text-gray-400 uppercase">
                    No users matching criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs text-[#f15a14]">
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="text-xs font-bold text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-5 text-xs text-gray-500 font-medium">{user.email}</td>
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5">
                      {user.isBlocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <ShieldAlert className="w-3 h-3" /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          <UserCheck className="w-3 h-3" /> Active
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <Button
                        onClick={() => handleToggleBlock(user._id)}
                        variant={user.isBlocked ? "outline" : "destructive"}
                        className="rounded-full text-[10px] font-bold uppercase tracking-wider h-8 px-4 transition-all"
                      >
                        {user.isBlocked ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" /> Unblock
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3 h-3 mr-1" /> Block User
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
