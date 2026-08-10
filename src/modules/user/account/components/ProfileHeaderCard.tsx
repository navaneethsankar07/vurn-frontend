import { ExternalLink, Ticket } from "lucide-react";
import type { ProfileHeaderCardProps } from "../types";
import { formatMonthYear } from "@/utils/date";

export function ProfileHeaderCard({
  user,
  onTokenTransactionsClick,
}: ProfileHeaderCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[3px] border border-white/10 bg-[#0C0C0E] p-6 font-mono">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-white/5">
          <img
            src={user.avatar || "https://placehold.net/avatar.svg"}
            alt={user.full_name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {user.full_name}
          </h2>
          <span className="text-sm text-gray-400">@{user.username}</span>
          <span className="text-sm text-gray-400">{user.email}</span>
          <span className="mt-2 text-xs text-gray-500">
            Member since {formatMonthYear(user.created_at)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onTokenTransactionsClick}
        className="flex items-center gap-2 rounded-[3px] border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-500 transition-colors hover:bg-amber-500/20"
      >
        <Ticket className="h-4 w-4" />
        <span>AI Token Transactions</span>
        <ExternalLink className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
