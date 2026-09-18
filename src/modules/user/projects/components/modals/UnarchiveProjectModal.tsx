import { RotateCcw, Loader2 } from "lucide-react";

interface UnarchiveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function UnarchiveProjectModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: UnarchiveProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0C0C0E] border border-white/10 rounded-sm shadow-2xl p-6 space-y-6 font-mono text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <RotateCcw className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold">Unarchive Project</h3>
        </div>

        <div className="space-y-3 text-xs text-neutral-300">
          <p>Are you sure you want to restore this project?</p>
          <p className="text-neutral-400">This action will:</p>
          <ul className="list-disc list-inside space-y-1.5 text-neutral-400 pl-1">
            <li>Restore full read and write access to the project.</li>
            <li>Make it visible again in the default project list.</li>
            <li>Allow team members to resume creating and modifying issues.</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-semibold rounded-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-sm transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Unarchive Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
