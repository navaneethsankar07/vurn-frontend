import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBacklogIssues } from "../../api/sprintQueries";
import { useAddIssuesToSprint } from "../../api/sprintMutations";

interface AddSprintIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  sprintId: string | number;
}

export function AddSprintIssuesModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  sprintId,
}: AddSprintIssuesModalProps) {
  const [page, setPage] = useState(1);
  const [selectedIssueIds, setSelectedIssueIds] = useState<number[]>([]);

  const { data, isLoading } = useBacklogIssues(
    subdomain,
    projectSlug,
    page,
    isOpen,
  );
  const { mutate: addIssues, isPending: isAdding } = useAddIssuesToSprint();

  const issues = data?.results || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / 5) || 1;

  const handleToggleSelect = (id: number) => {
    setSelectedIssueIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIssueIds.length === issues.length) {
      setSelectedIssueIds([]);
    } else {
      setSelectedIssueIds(issues.map((i) => i.id));
    }
  };

  const handleSubmit = () => {
    if (selectedIssueIds.length === 0) return;
    addIssues(
      {
        subdomain,
        projectSlug,
        sprint_id: sprintId,
        issue_ids: selectedIssueIds,
      },
      {
        onSuccess: () => {
          setSelectedIssueIds([]);
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-mono">
      <div className="bg-[#09090B] border border-white/10 rounded-xs w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Add Backlog Issues to Sprint
            </h2>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Select available backlog issues to move into this sprint.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-zinc-500 text-xs gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading backlog issues...</span>
          </div>
        ) : issues.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs italic font-sans">
            No backlog issues available to add.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-primary hover:underline cursor-pointer"
              >
                {selectedIssueIds.length === issues.length
                  ? "Deselect All on Page"
                  : "Select All on Page"}
              </button>
              <span>{selectedIssueIds.length} selected</span>
            </div>

            <div className="border border-white/10 rounded-xs divide-y divide-white/5 max-h-72 overflow-y-auto">
              {issues.map((issue) => {
                const isSelected = selectedIssueIds.includes(issue.id);
                return (
                  <div
                    key={issue.id}
                    onClick={() => handleToggleSelect(issue.id)}
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-4 w-4 rounded-xs border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-black"
                            : "border-white/20 bg-black"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-3" />}
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400 mr-2">
                          {issue.key}
                        </span>
                        <span className="text-xs text-zinc-200 font-sans">
                          {issue.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-white/10 bg-white/5 rounded-xs text-zinc-400">
                      {issue.issue_type}
                    </span>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 text-xs text-zinc-400">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-7 px-2 border-white/10 bg-black text-zinc-300 hover:text-white rounded-xs disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-7 px-2 border-white/10 bg-black text-zinc-300 hover:text-white rounded-xs disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-8 px-4 text-xs border-white/10 bg-black text-zinc-300 hover:bg-zinc-900 rounded-xs cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={selectedIssueIds.length === 0 || isAdding}
            onClick={handleSubmit}
            className="h-8 px-4 text-xs bg-primary text-black hover:bg-primary/90 font-semibold rounded-xs gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAdding && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Add to Sprint ({selectedIssueIds.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
