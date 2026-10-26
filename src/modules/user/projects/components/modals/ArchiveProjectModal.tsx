import { Archive, Loader2 } from "lucide-react";

interface ArchiveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function ArchiveProjectModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: ArchiveProjectModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#0C0C0E] border border-white/10 rounded-sm shadow-2xl p-6 space-y-6 font-mono text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-sm bg-red-500/10 border border-red-500/20 text-red-400">
            <Archive className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold">Archive Project</h3>
        </div>

        <div className="space-y-3 text-xs text-neutral-300">
          <p>Are you sure you want to archive this project?</p>
          <p className="text-neutral-400">This action will:</p>
          <ul className="list-disc list-inside space-y-1.5 text-neutral-400 pl-1">
            <li>Make the project read-only.</li>
            <li>Hide it from the default project list.</li>
            <li>
              Preserve all issues, sprints, documents, repository connections,
              and activity.
            </li>
            <li>Allow the project to be restored later.</li>
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
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold rounded-sm transition-colors"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Archive className="h-3.5 w-3.5" />
                <span>Archive Project</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
