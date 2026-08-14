import { Plus, UserPlus, Shield, Settings, Trash2 } from "lucide-react";

export function QuickActions() {
  return (
    <div className="rounded border border-white/10 bg-[#09090b] p-4 space-y-3 font-mono">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Quick Actions
      </h3>
      <div className="space-y-1">
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Plus className="h-3.5 w-3.5 text-gray-400" />
          <span>Create Project</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <UserPlus className="h-3.5 w-3.5 text-gray-400" />
          <span>Invite Members</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Shield className="h-3.5 w-3.5 text-gray-400" />
          <span>Manage Roles</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Settings className="h-3.5 w-3.5 text-gray-400" />
          <span>Organization Settings</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-400" />
          <span>Delete Organization</span>
        </button>
      </div>
    </div>
  );
}
