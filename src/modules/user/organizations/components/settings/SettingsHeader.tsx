import { getSubdomain } from "@/utils/subdomain";
import { ChevronRight } from "lucide-react";


export function SettingsHeader() {

  const subdomain = getSubdomain()
  return (
    <div className="space-y-3 p-4 sm:p-6 lg:p-8 font-mono border-b border-white/10 pb-6">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{subdomain}</span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
        <span className="text-gray-500">Settings</span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Organization Settings
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your organization's details, branding, preferences and
          integrations.
        </p>
      </div>
    </div>
  );
}
