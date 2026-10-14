import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAiGenerateReleaseNotes } from "../api/aiMutations";
import type { ReleaseNotesFormValues } from "../schemas/releaseNotesSchema";
import type { GitHubRepository } from "../../integrations/github/types";
import { getSubdomain } from "@/utils/subdomain";
import type { AiReleaseNotesResponse } from "../types";
import { ReleaseNotesForm } from "./ReleaseNotesForm";
import { ReleaseNotesResultView } from "./ReleaseNotesResultView";

interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectSlug: string;
  repositories: GitHubRepository[];
  defaultRepositoryId?: number;
}

export function ReleaseNotesModal({
  isOpen,
  onClose,
  projectSlug,
  repositories,
  defaultRepositoryId,
}: ReleaseNotesModalProps) {
  const [resultData, setResultData] = useState<AiReleaseNotesResponse | null>(
    null,
  );

  const defaultRepoId =
    defaultRepositoryId ??
    (repositories.length === 1 ? repositories[0].id : undefined);

  const { mutate: generateNotes, isPending } = useAiGenerateReleaseNotes();

  const handleGenerate = (values: ReleaseNotesFormValues) => {
    const orgSlug = getSubdomain() || "default";

    generateNotes(
      {
        organization_slug: orgSlug,
        project_slug: projectSlug,
        repository_id: Number(values.repository_id),
        start_date: values.start_date,
        end_date: values.end_date,
      },
      {
        onSuccess: (data) => {
          setResultData(data);
          toast.success("Release notes generated successfully.");
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to generate release notes.";
          toast.error(msg);
        },
      },
    );
  };

  const handleClose = () => {
    setResultData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#09090B] border border-white/10 text-white font-mono w-[95vw] max-w-4xl sm:max-w-4xl rounded-xs shadow-2xl p-0 overflow-hidden">
        <div className="p-6 space-y-6 max-h-[88vh] flex flex-col">
          <DialogHeader className="space-y-1.5 text-left border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xs border border-primary/30 bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <DialogTitle className="text-sm font-bold uppercase tracking-wider text-white">
                AI Release Notes Generator
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-zinc-400 font-sans">
              Analyze commits and pull requests within a date range to draft
              professional release notes using Vurn AI.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-100 overflow-y-auto space-y-6 pr-2">
            {!resultData ? (
              <ReleaseNotesForm
                repositories={repositories}
                defaultRepositoryId={defaultRepoId}
                isPending={isPending}
                onSubmit={handleGenerate}
              />
            ) : (
              <ReleaseNotesResultView resultData={resultData} />
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0 bg-transparent">
            {resultData ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setResultData(null)}
                className="h-8 text-xs bg-transparent text-primary hover:bg-transparent border border-primary/30 font-semibold rounded-xs gap-1.5 cursor-pointer font-mono"
              >
                Change Parameters
              </Button>
            ) : (
              <div />
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-8 border-white/10 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white text-xs rounded-xs font-sans transition-colors cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
