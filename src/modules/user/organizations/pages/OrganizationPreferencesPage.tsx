import { useState, useEffect } from "react";
import { Loader2, ShieldCheck, UserPlus, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { getSubdomain } from "@/utils/subdomain";
import { useOrganizationPreferencesQuery } from "../api/organizationQueries";
import { useUpdateOrganizationPreferencesMutation } from "../api/organizationMutations";

export function OrganizationPreferencesPage() {
  const subdomain = getSubdomain() || "";

  const {
    data: preferences,
    isLoading,
    isError,
  } = useOrganizationPreferencesQuery(subdomain);

  const updateMutation = useUpdateOrganizationPreferencesMutation(subdomain);

  const [allowAdminInvitations, setAllowAdminInvitations] = useState(false);
  const [allowMemberInvitations, setAllowMemberInvitations] = useState(false);
  const [allowMemberProjectCreation, setAllowMemberProjectCreation] =
    useState(false);

  useEffect(() => {
    if (preferences) {
      setAllowAdminInvitations(Boolean(preferences.allow_admin_invitations));
      setAllowMemberInvitations(Boolean(preferences.allow_member_invitations));
      setAllowMemberProjectCreation(
        Boolean(preferences.allow_member_project_creation),
      );
    }
  }, [preferences]);

  const hasChanges = Boolean(
    preferences &&
    (allowAdminInvitations !== Boolean(preferences.allow_admin_invitations) ||
      allowMemberInvitations !==
        Boolean(preferences.allow_member_invitations) ||
      allowMemberProjectCreation !==
        Boolean(preferences.allow_member_project_creation)),
  );

  const handleReset = () => {
    if (preferences) {
      setAllowAdminInvitations(Boolean(preferences.allow_admin_invitations));
      setAllowMemberInvitations(Boolean(preferences.allow_member_invitations));
      setAllowMemberProjectCreation(
        Boolean(preferences.allow_member_project_creation),
      );
    }
  };

  const handleSave = () => {
    if (!subdomain) {
      toast.error("Invalid organization subdomain");
      return;
    }

    updateMutation.mutate(
      {
        allow_admin_invitations: allowAdminInvitations,
        allow_member_invitations: allowMemberInvitations,
        allow_member_project_creation: allowMemberProjectCreation,
      },
      {
        onSuccess: () => {
          toast.success("Preferences saved successfully");
        },
        onError: () => {
          toast.error("Failed to update preferences");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center p-4">
        <Loader2 className="size-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (isError || !subdomain) {
    return (
      <div className="mx-auto max-w-4xl p-4 text-xs sm:text-sm font-mono text-red-400 sm:p-6">
        Failed to load preferences for this organization.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 px-3 py-4 font-mono text-white sm:px-6 sm:py-6">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Organization Preferences
      </div>

      <div className="overflow-hidden rounded-[3px] border border-white/10 bg-[#09090b]">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-white">
            Access & Governance
          </h2>
          <p className="mt-1 text-xs text-gray-400">
            Control member invitation permissions and project creation settings.
          </p>
        </div>

        <div className="divide-y divide-white/5">
          <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5">
            <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 pr-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <div className="min-w-0">
                <label
                  htmlFor="admin-invites"
                  className="cursor-pointer select-none text-xs font-medium text-white block truncate"
                >
                  Allow Admin Invitations
                </label>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400 wrap-break-words">
                  Allow organization administrators to invite new members to
                  this workspace.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end">
              <button
                id="admin-invites"
                type="button"
                role="switch"
                aria-checked={allowAdminInvitations}
                onClick={() => setAllowAdminInvitations((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowAdminInvitations ? "bg-amber-500" : "bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    allowAdminInvitations ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5">
            <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 pr-2">
              <UserPlus className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <div className="min-w-0">
                <label
                  htmlFor="member-invites"
                  className="cursor-pointer select-none text-xs font-medium text-white block truncate"
                >
                  Allow Member Invitations
                </label>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400 wrap-break-words">
                  Allow standard organization members to send workspace
                  invitation links.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end">
              <button
                id="member-invites"
                type="button"
                role="switch"
                aria-checked={allowMemberInvitations}
                onClick={() => setAllowMemberInvitations((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowMemberInvitations ? "bg-amber-500" : "bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    allowMemberInvitations ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5">
            <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 pr-2">
              <FolderPlus className="mt-0.5 size-4 shrink-0 text-amber-500" />
              <div className="min-w-0">
                <label
                  htmlFor="member-projects"
                  className="cursor-pointer select-none text-xs font-medium text-white block truncate"
                >
                  Allow Member Project Creation
                </label>
                <p className="mt-0.5 text-[11px] leading-relaxed text-gray-400 wrap-break-words">
                  Permit standard members to create new projects without
                  requiring admin approval.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end">
              <button
                id="member-projects"
                type="button"
                role="switch"
                aria-checked={allowMemberProjectCreation}
                onClick={() => setAllowMemberProjectCreation((prev) => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowMemberProjectCreation ? "bg-amber-500" : "bg-white/10"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    allowMemberProjectCreation
                      ? "translate-x-4"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-2">
        <span className="text-[11px] text-gray-500 text-center sm:text-left">
          {hasChanges ? "Unsaved changes pending" : "All changes saved."}
        </span>
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || updateMutation.isPending}
            className="flex-1 sm:flex-none cursor-pointer px-4 py-2 text-xs font-medium text-gray-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || updateMutation.isPending}
            className="flex-1 sm:flex-none flex cursor-pointer items-center justify-center gap-2 rounded-[3px] border border-amber-500/80 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-500 transition-colors hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {updateMutation.isPending && (
              <Loader2 className="size-3.5 animate-spin" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
