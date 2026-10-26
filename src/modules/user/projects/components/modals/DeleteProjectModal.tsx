import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Trash2, Loader2, X } from "lucide-react";
import {
  createDeleteProjectSchema,
  type DeleteProjectFormData,
} from "../../schemas/projectDeleteSchema";

interface DeleteProjectModalProps {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: (confirmation: string) => void;
  isPending: boolean;
}

export function DeleteProjectModal({
  isOpen,
  projectName,
  onClose,
  onConfirm,
  isPending,
}: DeleteProjectModalProps) {
  const requiredConfirmationText = `DELETE ${projectName}`;
  const schema = createDeleteProjectSchema(requiredConfirmationText);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeleteProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: { confirmation: "" },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ confirmation: "" });
    }
  }, [isOpen, projectName, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    reset({ confirmation: "" });
    onClose();
  };

  const onSubmit = (data: DeleteProjectFormData) => {
    onConfirm(data.confirmation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-[#0C0C0E] border border-white/10 rounded-xs shadow-2xl overflow-hidden font-mono text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xs bg-red-500/10 border border-red-500/20 text-[#E5484D]">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight text-white">
              Delete Project
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="text-neutral-400 hover:text-white p-1 rounded-xs transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          <div className="p-4 rounded-xs border border-red-500/20 bg-red-500/5 space-y-1.5">
            <p className="text-[11px] font-bold text-[#E5484D] uppercase tracking-wider">
              This action is permanent.
            </p>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Deleting this project will permanently remove all associated data
              including issues, sprints, workflows, and history.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-neutral-300 block">
                To confirm, type{" "}
                <code className="bg-black/60 border border-white/10 px-1.5 py-0.5 rounded-xs text-[#E5484D] font-bold select-all">
                  DELETE {projectName}
                </code>{" "}
                below.
              </label>

              <input
                {...register("confirmation")}
                type="text"
                placeholder={`DELETE ${projectName}`}
                autoFocus
                className="w-full bg-black/50 border border-white/10 rounded-xs px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-colors"
              />

              {errors.confirmation ? (
                <p className="text-xs text-[#E5484D]">
                  {errors.confirmation.message}
                </p>
              ) : (
                <p className="text-[11px] text-neutral-500">
                  Please type &quot;DELETE {projectName}&quot; to confirm.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium rounded-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-[#E5484D] hover:bg-red-500 text-white text-xs font-semibold rounded-xs transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
