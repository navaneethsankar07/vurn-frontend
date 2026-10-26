import { Plus, Users, Settings } from "lucide-react";

export function ProjectQuickActions() {
  return (
    <div className="border border-white/10 rounded bg-[#0C0C0E] p-5 space-y-3 font-mono">
      <h3 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-white/5 pb-3">
        Quick Actions
      </h3>

      <div className="space-y-1 pt-1 text-xs">
        <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left cursor-pointer">
          <Plus className="h-3.5 w-3.5 text-primary" />
          <span>Create Sprint</span>
        </button>
        <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left cursor-pointer">
          <Plus className="h-3.5 w-3.5 text-primary" />
          <span>Create Issue</span>
        </button>
        <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left cursor-pointer">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>Manage Members</span>
        </button>
        <button className="w-full flex items-center gap-2 p-2 hover:bg-white/5 rounded text-gray-300 hover:text-white transition-colors text-left cursor-pointer">
          <Settings className="h-3.5 w-3.5 text-primary" />
          <span>Project Settings</span>
        </button>
      </div>
    </div>
  );
}
