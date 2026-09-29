import { useRef, useState } from "react";
import {
  Paperclip,
  Loader2,
  FileText,
  Download,
  Trash2,
  FileUp,
} from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useIssueAttachments } from "../api/issueQueries";
import {
  useAttachmentUploadWorkflow,
  useDeleteIssueAttachment,
} from "../api/issueMutations";
import { DeleteAttachmentConfirmationModal } from "./modals/DeleteAttachmentConfirmationModal";
import type { AttachmentItem } from "../types";

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
  const [activeFileName, setActiveFileName] = useState("");
  const [selectedAttachment, setSelectedAttachment] =
    useState<AttachmentItem | null>(null);

  const deleteModal = useModal();

  const { data, isLoading } = useIssueAttachments({
    subdomain,
    projectSlug,
    issueId,
  });

  const { mutate: uploadFile, isPending } = useAttachmentUploadWorkflow();
  const { mutate: deleteAttachment, isPending: isDeleting } =
    useDeleteIssueAttachment();

  const attachments = data?.results || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveFileName(file.name);
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
          setActiveFileName("");
        },
      },
    );
  };

  const confirmDelete = (file: AttachmentItem) => {
    setSelectedAttachment(file);
    deleteModal.openModal();
  };

  const handleDelete = () => {
    if (!selectedAttachment) return;
    deleteAttachment(
      {
        subdomain,
        projectSlug,
        issueId,
        attachmentId: selectedAttachment.id,
      },
      {
        onSuccess: () => {
          deleteModal.closeModal();
          setSelectedAttachment(null);
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
    <div className="space-y-2.5">
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
          <span>{isPending ? "Uploading..." : "Attach"}</span>
        </button>
      </div>

      {isPending && (
        <div className="p-3 bg-black/60 border border-white/10 rounded-xs space-y-2.5 font-mono animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 min-w-0 pr-2">
              <FileUp className="h-3.5 w-3.5 text-amber-500 shrink-0 animate-bounce" />
              <span className="text-zinc-200 font-sans truncate">
                {activeFileName || "Uploading file..."}
              </span>
            </div>
            <span className="text-amber-500 font-semibold shrink-0">
              {progress}%
            </span>
          </div>

          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300 ease-out"
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
            <div
              key={file.id}
              className="flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors group"
            >
              <a
                href={file.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 min-w-0 pr-2 flex-1 cursor-pointer"
              >
                <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-zinc-200 font-sans truncate group-hover:text-white transition-colors">
                    {file.file_name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {formatFileSize(file.file_size)} • {file.uploaded_by_name}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={file.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Download / View"
                  className="p-1 text-zinc-500 hover:text-white transition-colors rounded-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => confirmDelete(file)}
                  title="Delete attachment"
                  className="p-1 text-zinc-500 hover:text-red-400 transition-colors rounded-xs cursor-pointer disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteAttachmentConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        fileName={selectedAttachment?.file_name || ""}
        isPending={isDeleting}
      />
    </div>
  );
}
