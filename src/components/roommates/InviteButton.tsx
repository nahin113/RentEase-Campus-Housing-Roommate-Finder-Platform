"use client";

import React, { useState } from "react";
import { UserPlus, Check, Loader2, X } from "lucide-react";
import { serverMutation } from "@/lib/core/server";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface InviteButtonProps {
  currentUserId: string | null;
  groupId: string | null;
  invitedUserId: string;
  groupMembers: string[];
  invitations: Array<{ invitedUserId: string; status: string }>;
  isLocked: boolean;
  isGroupCreator: boolean;
  hasGroup: boolean;
}

export default function InviteButton({
  currentUserId,
  groupId,
  invitedUserId,
  groupMembers,
  invitations,
  isLocked,
  isGroupCreator,
  hasGroup,
}: InviteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviting, setInviting] = useState(false);
  const router = useRouter();

  // Determine button state
  const isMember = groupMembers.includes(invitedUserId);
  const pendingInvite = invitations.find(
    (inv) => inv.invitedUserId === invitedUserId && inv.status === "pending"
  );

  const handleOpenModal = () => {
    if (!hasGroup) {
      toast.error("You must create a roommate group first to invite others!");
      return;
    }

    if (!isGroupCreator) {
      toast.error("Only the group creator can invite roommates!");
      return;
    }

    if (isLocked) {
      toast.error("Your group details are locked due to an approved lease.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);
    try {
      const res = await serverMutation(
        `/api/groups/invite`,
        { senderId: currentUserId, receiverId: invitedUserId, groupId, message: inviteMessage.trim() },
        "POST"
      );
      if (res && res.success) {
        toast.success("Invitation sent successfully!");
        setIsModalOpen(false);
        setInviteMessage("");
        router.refresh();
      } else {
        toast.error(res?.message || "Failed to send invitation");
      }
    } catch (err: any) {
      toast.error(err?.message || "An error occurred");
    } finally {
      setInviting(false);
    }
  };

  if (isMember) {
    return (
      <button
        disabled
        className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-medium cursor-not-allowed opacity-90 text-sm"
      >
        <Check className="w-4 h-4" /> Group Member
      </button>
    );
  }

  if (pendingInvite) {
    return (
      <button
        disabled
        className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full font-medium cursor-not-allowed opacity-90 text-sm"
      >
        <Loader2 className="w-4 h-4 animate-spin" /> Invitation Pending
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 bg-[#f15a14] hover:bg-[#d94f10] text-white px-6 py-3 rounded-full font-medium transition-colors text-sm"
      >
        <UserPlus className="w-4 h-4" /> Invite to Group
      </button>

      {/* Invitation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setInviteMessage("");
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#f15a14]" /> Invite Roommate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send a personalized invitation message to join your roommates group.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Invitation Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Hey, we checked your profile and think you'd be a great match for our roommates group! Would you like to join us?"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 focus:border-[#f15a14] focus:ring-1 focus:ring-[#f15a14]/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all duration-200 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setInviteMessage("");
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="bg-[#f15a14] hover:bg-[#d94f10] text-white rounded-xl px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
