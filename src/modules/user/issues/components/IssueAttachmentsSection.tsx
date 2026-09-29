import { useRef, useState } from "react";
import {
  Paperclip,
  Loader2,
  UploadCloud,
  FileText,
  Download,
} from "lucide-react";
import { useIssueAttachments } from "../api/issueQueries";
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

  const { data, isLoading } = useIssueAttachments({
    subdomain,
    projectSlug,
    issueId,
  });

  const { mutate: uploadFile, isPending } = useAttachmentUploadWorkflow();

  const attachments = data?.results || [];

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-zinc-400">
        <span className="text-[10px] font-semibold uppercase tracking-wider">
          Attachments ({attachments.length})
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

      {isPending && (
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
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-4 text-xs text-zinc-500 gap-1.5">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          <span>Loading attachments...</span>
        </div>
      ) : attachments.length === 0 && !isPending ? (
        <div className="p-3 border border-dashed border-white/10 rounded-xs text-center text-zinc-600 text-[11px] font-sans">
          No files attached yet.
        </div>
      ) : (
        <div className="border border-white/10 bg-black/40 rounded-xs divide-y divide-white/5 overflow-hidden">
          {attachments.map((file) => (
            <a
              key={file.id}
              href={file.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-200 font-sans truncate group-hover:text-white transition-colors">
                    {file.file_name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {formatFileSize(file.file_size)} • {file.uploaded_by_name}
                  </p>
                </div>
              </div>

              <Download className="h-3.5 w-3.5 text-zinc-600 group-hover:text-amber-500 shrink-0 transition-colors" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
