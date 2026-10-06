import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import {
  createTagSchema,
  type CreateTagInput,
} from "../schemas/createTagSchema";
import { useCreateDocumentTag } from "../api/knowledgeMutations";

interface CreateDocumentTagFormProps {
  subdomain: string;
  projectSlug: string;
  documentId: number;
  onClose: () => void;
}

export function CreateDocumentTagForm({
  subdomain,
  projectSlug,
  documentId,
  onClose,
}: CreateDocumentTagFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTagInput>({
    resolver: zodResolver(createTagSchema),
    defaultValues: { name: "" },
  });

  const { mutate: createTag, isPending } = useCreateDocumentTag(
    subdomain,
    projectSlug,
    documentId,
  );

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const onSubmit = (data: CreateTagInput) => {
    createTag(
      { name: data.name.trim() },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  const { ref: formRegisterRef, ...restRegister } = register("name");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-2 pt-1 font-mono"
    >
      <div className="relative">
        <input
          {...restRegister}
          ref={(e) => {
            formRegisterRef(e);
            inputRef.current = e;
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
          }}
          placeholder="tag-name"
          className="w-full h-7 px-2 pr-12 bg-black border border-amber-500/50 text-white text-xs rounded-xs focus:outline-hidden placeholder:text-zinc-600"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="submit"
            disabled={isPending}
            title="Save tag"
            className="p-1 text-amber-500 hover:text-amber-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            title="Cancel"
            className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      {errors.name && (
        <p className="text-[10px] text-red-400 px-1 font-sans">
          {errors.name.message}
        </p>
      )}
    </form>
  );
}
