import { useParams } from "react-router-dom";
import { Archive, Trash2, AlertTriangle } from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { useModal } from "@/hooks/useModal";
import { useProjectSettings } from "../api/projectQueries";
import { useArchiveProject, useDeleteProject } from "../api/projectMutations";
import { ArchiveProjectModal } from "../components/modals/ArchiveProjectModal";
import { DeleteProjectModal } from "../components/modals/DeleteProjectModal";

export function DangerZoneSection() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";

  const { data: projectData } = useProjectSettings(
    subdomain,
    projectSlug || "",
  );

  const archiveModal = useModal(false);
  const deleteModal = useModal(false);

  const { mutate: archiveProj, isPending: isArchiving } = useArchiveProject({
    subdomain,
    projectSlug: projectSlug || "",
  });

  const { mutate: deleteProj, isPending: isDeleting } = useDeleteProject({
    subdomain,
    projectSlug: projectSlug || "",
  });

  const handleArchiveConfirm = () => {
    archiveProj(undefined, {
      onSuccess: archiveModal.closeModal,
    });
  };

  const handleDeleteConfirm = (confirmationText: string) => {
    deleteProj(
      { confirmation: confirmationText },
      {
        onSuccess: deleteModal.closeModal,
      },
    );
  };

  const projectName = projectData?.name || "";

  return (
    <div className="max-w-4xl font-mono text-white space-y-6">
      <div className="border border-red-500/20 bg-[#0C0C0E] rounded-xs p-6 space-y-6">
        <div className="flex items-center gap-2 text-[#E5484D]">
          <AlertTriangle className="h-4 w-4" />
          <h2 className="text-base font-semibold">Danger Zone</h2>
        </div>

        <div className="divide-y divide-white/10">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <h3 className="text-xs font-semibold text-white">
                Archive Project
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Archived projects become read-only and are hidden from the
                default Projects list. They can still be viewed by filtering for
                archived projects and can be restored later.
              </p>
            </div>
            <button
              type="button"
              onClick={archiveModal.openModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xs transition-colors shrink-0"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>Archive Project</span>
            </button>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <h3 className="text-xs font-semibold text-white">
                Delete Project
              </h3>
              <p className="text-xs text-red-400 font-semibold">
                Deleting a project permanently removes all project data. This
                action cannot be undone.
              </p>
              <div className="pt-2 text-xs text-neutral-400">
                <p>The following will be permanently deleted:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-[11px] text-neutral-500">
                  <span>• Issues</span>
                  <span>• Sprints</span>
                  <span>• Workflow</span>
                  <span>• Repository connection</span>
                  <span>• Documents</span>
                  <span>• Activity history</span>
                  <span>• Project settings</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={deleteModal.openModal}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#E5484D] hover:bg-red-500 text-white text-xs font-semibold rounded-xs transition-colors shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Project</span>
            </button>
          </div>
        </div>
      </div>

      <ArchiveProjectModal
        isOpen={archiveModal.isOpen}
        onClose={archiveModal.closeModal}
        onConfirm={handleArchiveConfirm}
        isPending={isArchiving}
      />

      <DeleteProjectModal
        isOpen={deleteModal.isOpen}
        projectName={projectName}
        onClose={deleteModal.closeModal}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  );
}
