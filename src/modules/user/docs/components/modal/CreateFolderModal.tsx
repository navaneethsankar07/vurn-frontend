import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  createFolderSchema,
  type CreateFolderInput,
} from "../../schemas/createFolderSchema";
import { useCreateDocumentFolder } from "../../api/knowledgeMutations";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
}

export function CreateFolderModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
}: CreateFolderModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFolderInput>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: { name: "" },
  });

  const { mutate: createFolder, isPending } = useCreateDocumentFolder(
    subdomain,
    projectSlug,
  );

  useEffect(() => {
    if (isOpen) {
      reset({ name: "" });
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: CreateFolderInput) => {
    createFolder(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  const { ref: formRegisterRef, ...restRegister } = register("name");

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
          placeholder="folder-name"
          className="w-full h-7 px-2 bg-black border border-amber-500/50 text-white text-xs rounded-xs focus:outline-hidden font-mono placeholder:text-zinc-600"
        />
        {errors.name && (
          <p className="text-[10px] text-red-400 px-1 font-sans">
            {errors.name.message}
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
