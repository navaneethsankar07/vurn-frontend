import {
  GitCommit,
  MessageSquare,
  CheckCircle2,
  Mail,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type { ProfileActivity, ProfileActivityType, RecentActivityCardProps } from "../types";
import { formatTimeAgo } from "@/utils/date";

const ICON_MAP: Record<ProfileActivityType, LucideIcon> = {
  issue_created: GitCommit,
  comment_added: MessageSquare,
  issue_closed: CheckCircle2,
  invitation_accepted: Mail,
  organization_joined: Building2,
};

export function RecentActivityCard({ activities }: RecentActivityCardProps) {
  return (
    <div className="rounded-[3px] border border-white/10 bg-[#0C0C0E] font-mono overflow-hidden">
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="text-sm font-normal text-white">Recent Activity</h3>
      </div>
      <div className="divide-y divide-white/10">
        {activities.map((act: ProfileActivity, index: number) => {
          const Icon = ICON_MAP[act.type] || GitCommit;
          return (
            <div
              key={`${act.type}-${act.timestamp}-${index}`}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div className="flex items-start gap-3.5">
                <Icon className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-sm text-white">{act.title}</span>
                  <span className="text-xs text-gray-500 mt-1">
                    {act.description}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500 shrink-0 self-start sm:self-center">
                {formatTimeAgo(act.timestamp)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
