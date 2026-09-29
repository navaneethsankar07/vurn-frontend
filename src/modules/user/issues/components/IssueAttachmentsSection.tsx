import { useRef, useState } from "react";
import { Paperclip, Loader2, UploadCloud } from "lucide-react";
import { useAttachmentUploadWorkflow } from "../api/issueMutations";

interface IssueAttachmentsSectionProps {
  subdomain: string;
  projectSlug: string;
  issueId: number | string;
}

export function IssueAttachmentsSection({
  subdomain,
  projectSlug,
  issueId,
}: IssueAttachmentsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);

  const { mutate: uploadFile, isPending } = useAttachmentUploadWorkflow();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProgress(0);
    uploadFile(
      {
        subdomain,
        projectSlug,
        issueId,
        file,
        onProgress: (p) => setProgress(p),
      },
      {
        onSettled: () => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
      },
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-zinc-400">
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          Attachments
        </span>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          disabled={isPending}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1 text-[11px] text-amber-500 hover:text-amber-400 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Paperclip className="h-3 w-3" />
          )}
          <span>{isPending ? `Uploading ${progress}%` : "Attach"}</span>
        </button>
      </div>

      {isPending ? (
        <div className="p-3 border border-amber-500/30 bg-amber-500/5 rounded-xs space-y-2 font-mono">
          <div className="flex items-center justify-between text-[11px] text-zinc-300">
            <span className="flex items-center gap-1.5 truncate">
              <UploadCloud className="h-3.5 w-3.5 text-amber-500 shrink-0 animate-pulse" />
              <span className="truncate">Uploading file to S3...</span>
            </span>
            <span className="font-semibold text-amber-500">{progress}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="p-3 border border-dashed border-white/10 rounded-xs text-center text-zinc-600 text-[11px] font-sans">
          No files attached yet.
        </div>
      )}
    </div>
  );
}
