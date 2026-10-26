import { useParams } from "react-router-dom";
import { Archive, Trash2, ShieldAlert } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { RequestDeleteModal } from "../components/settings/RequestDeleteModal";
import { ConfirmDeleteModal } from "../components/settings/ConfirmDeleteModal";
import { ArchiveOrgModal } from "../components/settings/ArchiveOrgModal";
import {
  useOrganizationAccess,
  useOrganizationDashboardQuery,
} from "../api/organizationQueries";
import { getSubdomain } from "@/utils/subdomain";

export function DangerZonePage() {
  const { slug: paramSlug } = useParams<{ slug?: string }>();
  const slug = paramSlug || getSubdomain() || "";

  const { data: orgData } = useOrganizationDashboardQuery(slug);
  const { data: accessData } = useOrganizationAccess(slug);
  const isOwner = accessData?.role === "owner";

  const archiveModal = useModal();
  const deleteRequestModal = useModal();
  const confirmDeleteModal = useModal();

  const orgName = orgData?.name || "Organization";

  const handleRequestSuccess = () => {
    deleteRequestModal.closeModal();
    confirmDeleteModal.openModal();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 font-mono text-xs px-4 sm:px-6 py-4 select-none">
      <div className="text-gray-400 text-xs">Danger Zone</div>

      {!isOwner && (
        <div className="flex items-center gap-2.5 p-3.5 rounded border border-primary/70 text-primary text-xs">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            Only the organization owner can perform destructive actions. You
            have view-only access.
          </span>
        </div>
      )}

      <div className="rounded border border-[#F87171]/30 bg-[#09090b] shadow-2xl">
        <div className="border-b border-[#F87171]/20 p-5 sm:p-6 space-y-1">
          <h2 className="text-sm font-semibold text-[#F87171]">Danger Zone</h2>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            Irreversible and destructive actions. Proceed with caution.
          </p>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1 max-w-md">
              <h3 className="text-white font-medium text-xs sm:text-sm">
                Archive Organization
              </h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Archive the organization and make all projects read-only. You
                can restore it later.
              </p>
            </div>
            <button
              type="button"
              disabled={!isOwner}
              onClick={archiveModal.openModal}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#121215] hover:bg-[#18181c] text-gray-300 hover:text-white border border-white/10 rounded-xs text-xs transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#121215] disabled:hover:text-gray-300"
            >
              <Archive className="h-3.5 w-3.5 text-gray-400" />
              <span>Archive Organization</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-md">
              <h3 className="text-white font-medium text-xs sm:text-sm">
                Delete Organization
              </h3>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Permanently delete the organization, projects, documents,
                members and all associated data. This cannot be undone.
              </p>
            </div>
            <button
              type="button"
              disabled={!isOwner}
              onClick={deleteRequestModal.openModal}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-[#121215] hover:bg-[#1c1214] text-[#F87171] border border-[#F87171]/30 hover:border-[#F87171]/50 rounded-xs text-xs transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#121215] disabled:hover:border-[#F87171]/30"
            >
              <Trash2 className="h-3.5 w-3.5 text-[#F87171]" />
              <span>Delete Organization</span>
            </button>
          </div>
        </div>
      </div>

      {isOwner && (
        <>
          <ArchiveOrgModal
            isOpen={archiveModal.isOpen}
            onClose={archiveModal.closeModal}
            orgName={orgName}
            slug={slug}
          />

          <RequestDeleteModal
            isOpen={deleteRequestModal.isOpen}
            onClose={deleteRequestModal.closeModal}
            orgName={orgName}
            slug={slug}
            onSuccessNext={handleRequestSuccess}
          />

          <ConfirmDeleteModal
            isOpen={confirmDeleteModal.isOpen}
            onClose={confirmDeleteModal.closeModal}
            slug={slug}
            orgName={orgName}
          />
        </>
      )}
    </div>
  );
}
