import { Paperclip, Loader2, Download, File as FileIcon } from "lucide-react";
import { useDocumentAttachments } from "../api/knowledgeQueries";

interface DocumentAttachmentsSectionProps {
  subdomain: string;
  projectSlug: string;
  documentId: number | null;
}

export function DocumentAttachmentsSection({
  subdomain,
  projectSlug,
  documentId,
}: DocumentAttachmentsSectionProps) {
  const { data, isLoading } = useDocumentAttachments(
    subdomain,
    projectSlug,
    documentId,
  );
  const attachments = data?.results || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
          Attachments
        </span>
        <div className="p-3 bg-black/40 border border-white/5 rounded-xs flex items-center justify-center text-zinc-500 text-xs gap-2">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-500" />
          <span>Loading attachments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Paperclip className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
          Attachments ({attachments.length})
        </span>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-xs overflow-hidden">
        {attachments.length === 0 ? (
          <div className="p-3.5">
            <p className="text-xs text-zinc-600 italic">No attachments.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="p-2.5 hover:bg-white/5 transition-colors group flex items-start justify-between gap-3 font-mono"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-1.5 bg-white/5 border border-white/10 rounded-xs shrink-0 text-zinc-400 group-hover:text-amber-500 transition-colors">
                    <FileIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p
                      className="text-[11px] text-zinc-300 font-medium truncate"
                      title={attachment.file_name}
                    >
                      {attachment.file_name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                      <span>{formatFileSize(attachment.file_size)}</span>
                      <span>•</span>
                      <span>
                        {new Date(attachment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <a
                  href={attachment.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-xs transition-colors shrink-0"
                  title="Download"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
