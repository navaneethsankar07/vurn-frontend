import {
  CircleCheck,
  CircleAlert,
  GitBranch,
  ExternalLink,
  Plus,
  Users,
  Settings,
  Sparkles,
  MessageSquare,
  GitPullRequest,
} from "lucide-react";
import { GithubIcon } from "@/utils/icons";

const RECENT_ACTIVITIES = [
  {
    id: "AUTH-142",
    action: "created",
    description: "Rotate refresh tokens on privilege change",
    time: "13m",
    icon: CircleAlert,
  },
  {
    id: "AUTH-138",
    action: "completed",
    description: "Enable multi-factor authentication with TOTP",
    time: "2h",
    icon: CircleCheck,
  },
  {
    id: "Sprint 24",
    action: "started",
    description: "24 issues planned · 8 days remaining",
    time: "3h",
    icon: Sparkles,
  },
  {
    id: "Comment added on AUTH-136",
    action: "",
    description: "Review requested by Priya Rajan",
    time: "5h",
    icon: MessageSquare,
  },
  {
    id: "Pull request linked",
    action: "",
    description: "#482 - Reduce token verification latency p99",
    time: "Yesterday",
    icon: GitPullRequest,
  },
  {
    id: "AUTH-120",
    action: "closed",
    description: "Configure Redis cache fallback policy for session stores",
    time: "2d ago",
    icon: CircleCheck,
  },
];

export function ProjectOverviewPage() {
  return (
    <div className="space-y-5">
      {/* Subheader */}
      <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-2">
        <h2 className="font-bold text-white text-sm">Overview</h2>
        <span>Current cycle</span>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Issues */}
        <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Open Issues</span>
            <CircleAlert className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">42</span>
            <p className="text-[10px] text-gray-500 mt-1">8 assigned to you</p>
          </div>
        </div>

        <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Completed Issues</span>
            <CircleCheck className="h-4 w-4 text-[#22C55E]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">128</span>
            <p className="text-[10px] text-gray-500 mt-1">This project</p>
          </div>
        </div>

        <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Active Sprint</span>
            <GitBranch className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="text-xl font-bold text-white block truncate">
              Sprint 24
            </span>
            <p className="text-[10px] text-gray-500 mt-1">8 days remaining</p>
          </div>
        </div>

        <div className="border border-white/10 rounded bg-[#0C0C0E] p-4 flex flex-col justify-between h-28">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Github Repository</span>
            <GithubIcon className="h-4 w-4 text-gray-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-primary transition-colors cursor-pointer truncate">
              <span>acme/inference-gateway</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </div>
            <p className="text-[10px] text-[#8A8A8A] mt-1">
              Status: 
              <span className=" text-[#22C55E]"> Connected</span> 
              
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (Spans 2 Columns on Desktop) */}
        <div className="lg:col-span-2 border border-white/10 rounded bg-[#0C0C0E] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Recent Activity
            </h3>
            <button className="text-[11px] text-gray-400 hover:text-white transition-colors">
              View all
            </button>
          </div>

          <div className="divide-y divide-white/5">
            {RECENT_ACTIVITIES.map((activity, idx) => {
              const IconComp = activity.icon;
              return (
                <div
                  key={idx}
                  className="py-3 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <IconComp className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {activity.id}{" "}
                        {activity.action && (
                          <span className="text-gray-400 font-normal">
                            {activity.action}
                          </span>
                        )}
                      </p>
                      <p className="text-gray-400 text-[11px] truncate mt-0.5">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 shrink-0">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Planning Card */}
          <div className="border border-white/10 rounded bg-[#0C0C0E] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
                Planning
              </h3>
              <button className="text-[11px] text-primary hover:text-primary/80 transition-colors">
                Create Sprint
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <GitBranch className="h-3.5 w-3.5 text-primary" />
                  <span>Sprint 24</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Jul 21 - Aug 4 · 24 Issues planned
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[56%]" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>56% complete</span>
                  <span>8 days remaining</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 pt-1">
                No blockers reported this sprint.
              </p>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="border border-white/10 rounded bg-[#0C0C0E] p-5 space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-3">
              Quick Actions
            </h3>

            <div className="space-y-1 pt-1 text-xs">
              <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left">
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span>Create Sprint</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left">
                <Plus className="h-3.5 w-3.5 text-primary" />
                <span>Create Issue</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Manage Members</span>
              </button>
              <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left">
                <Settings className="h-3.5 w-3.5 text-primary" />
                <span>Project Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
