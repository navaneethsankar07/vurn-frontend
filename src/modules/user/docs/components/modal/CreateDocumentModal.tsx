import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  createDocumentSchema,
  type CreateDocumentInput,
} from "../../schemas/createDocumentSchema";
import { useCreateProjectDocument } from "../../api/knowledgeMutations";

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  folderId: number;
}

export function CreateDocumentModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  folderId,
}: CreateDocumentModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateDocumentInput>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: { folder_id: folderId, title: "", content: "content" },
  });

  const { mutate: createDocument, isPending } = useCreateProjectDocument(
    subdomain,
    projectSlug,
  );

  useEffect(() => {
    if (isOpen) {
      reset({ folder_id: folderId, title: "", content: "content" });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, folderId, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: CreateDocumentInput) => {
    createDocument(
      {
        folder_id: Number(folderId),
        title: data.title.trim(),
        content: data.content?.trim() || "content",
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  const { ref: formRegisterRef, ...restRegister } = register("title");

  return (
    <div className="p-2 border-b border-white/5 bg-black/40">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <input
          {...restRegister}
          ref={(e) => {
            formRegisterRef(e);
            inputRef.current = e;
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          placeholder="document-name"
          className="w-full h-7 px-2 bg-black border border-amber-500/50 text-white text-xs rounded-xs focus:outline-hidden font-mono placeholder:text-zinc-600"
        />
        {errors.title && (
          <p className="text-[10px] text-red-400 px-1 font-sans">
            {errors.title.message}
          </p>
        )}

        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-2 py-0.5 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-2.5 py-0.5 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-[11px] rounded-xs transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {isPending && <Loader2 className="h-3 w-3 animate-spin" />}
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
