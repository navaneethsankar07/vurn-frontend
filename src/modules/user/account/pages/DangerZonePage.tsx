import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DangerZonePage() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = () => {
    // TODO: Connect delete account API call
    if (confirm("Are you sure you want to permanently delete your account?")) {
      setIsDeleting(true);
      console.log("Account deletion confirmed");
    }
  };

  return (
    <div className="w-full max-w-5xl space-y-8 font-mono">
      {/* Section Header */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          Danger Zone
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Manage your personal account preferences.
        </p>
      </div>

      {/* Red Bordered Warning Container */}
      <div className="rounded-[3px] border border-red-500/30 bg-[#030303] overflow-hidden">
        <div className="border-b border-red-500/30 px-5 py-3 bg-red-500/5">
          <h3 className="text-xs font-semibold text-red-400 tracking-wide uppercase">
            Danger Zone
          </h3>
        </div>

        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Delete Account</h4>
            <p className="text-xs text-gray-400 max-w-md">
              This permanently deletes your account and removes all owned personal data.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors shrink-0 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isDeleting ? "Deleting..." : "Delete Account"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}