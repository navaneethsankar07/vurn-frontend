import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, Check, UserPlus, Users } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useOrganizationMembers } from "@/modules/user/organizations/api/organizationQueries";
import { useAddProjectMember } from "../../api/projectMutations";
import {
  addProjectMemberSchema,
  type AddProjectMemberFormValues,
} from "../../schemas/projectMemberSchema";
import { PROJECT_ROLE_EXAMPLES } from "../../constants";

interface AddProjectMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  existingUserIds?: number[];
}

export function AddProjectMemberModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  existingUserIds = [],
}: AddProjectMemberModalProps) {
  const [memberSearch, setMemberSearch] = useState("");

  const { data: orgMembersData, isLoading: isLoadingOrgMembers } =
    useOrganizationMembers({
      slug: subdomain,
      search: memberSearch,
      page: 1,
      page_size: 100,
    });

  const { mutate: addMember, isPending } = useAddProjectMember(
    subdomain,
    projectSlug,
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<AddProjectMemberFormValues>({
    resolver: zodResolver(addProjectMemberSchema),
  });

  const selectedUserId = watch("user_id");

  const getMemberUserId = (member: any): number => {
    return Number(
      member?.user_id ??
        member?.id ??
        member?.user?.id ??
        member?.user_info?.id ??
        0,
    );
  };

  const getMemberName = (member: any): string => {
    const name =
      member?.full_name ||
      member?.user?.full_name ||
      member?.user_info?.full_name ||
      (member?.first_name
        ? `${member.first_name} ${member.last_name || ""}`.trim()
        : null) ||
      member?.user?.username ||
      member?.username;

    if (name) return name;

    const email = member?.email || member?.user?.email || "";
    return email ? email.split("@")[0] : "Member";
  };

  const existingSet = new Set(existingUserIds.map((id) => Number(id)));

  useEffect(() => {
    if (isOpen) {
      reset();
      setMemberSearch("");
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    setMemberSearch("");
    onClose();
  };

  const onSubmit = (data: AddProjectMemberFormValues) => {
    if (!data.user_id) return;

    addMember(
      {
        user_id: Number(data.user_id),
        project_role: data.project_role?.trim() || undefined,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const detail =
            err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Failed to add project member.";

          if (status === 400) {
            setError("root", {
              message: detail || "User is already a project member.",
            });
          } else if (status === 403) {
            setError("root", {
              message: "You don't have permission to add project members.",
            });
          } else if (status === 404) {
            setError("root", {
              message: "Organization, project, or user not found.",
            });
          } else {
            setError("root", { message: detail });
          }
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-[#09090B] w-full sm:max-w-2xl border border-white/10 text-white rounded-xs font-mono p-6 sm:p-7 shadow-2xl">
        <DialogHeader className="space-y-1.5 border-b border-white/10 pb-4">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Add Member to Project
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 font-sans">
            Select an organization member to grant access to this project
            workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          {errors.root && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xs font-sans">
              {errors.root.message}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300 flex items-center justify-between">
              <span>
                Select Member <span className="text-red-400">*</span>
              </span>
              {selectedUserId && (
                <span className="text-[11px] text-primary font-normal">
                  1 member selected
                </span>
              )}
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <Input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Search organization members..."
                className="pl-9 h-9 border-white/10 bg-black text-white text-xs rounded-xs placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40"
              />
            </div>

            <Controller
              name="user_id"
              control={control}
              render={({ field }) => {
                const rawMembers = orgMembersData?.results || [];

                const availableMembers = rawMembers.filter((m: any) => {
                  const uId = getMemberUserId(m);
                  return uId > 0 && !existingSet.has(uId);
                });

                return (
                  <div className="border border-white/10 bg-black/50 rounded-xs max-h-56 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-zinc-800">
                    {isLoadingOrgMembers ? (
                      <div className="p-6 flex items-center justify-center text-xs text-zinc-500">
                        <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                        Loading organization members...
                      </div>
                    ) : availableMembers.length === 0 ? (
                      <div className="p-6 text-center space-y-1">
                        <Users className="h-5 w-5 text-zinc-600 mx-auto mb-2" />
                        <p className="text-xs text-zinc-400 font-medium">
                          No available members found
                        </p>
                        <p className="text-[11px] text-zinc-600 font-sans">
                          {rawMembers.length > 0
                            ? "All matching organization members are already in this project."
                            : "No organization members matched your search."}
                        </p>
                      </div>
                    ) : (
                      availableMembers.map((member: any) => {
                        const userId = getMemberUserId(member);
                        const memberName = getMemberName(member);
                        const memberEmail =
                          member?.email || member?.user?.email || "";
                        const memberAvatar =
                          member?.avatar || member?.user?.avatar || "";
                        const isSelected = Number(field.value) === userId;

                        return (
                          <button
                            key={userId || memberEmail}
                            type="button"
                            onClick={() => {
                              field.onChange(userId);
                              clearErrors("root");
                            }}
                            className={`w-full p-2.5 flex items-center justify-between text-left transition-colors ${
                              isSelected
                                ? "bg-white/10 border-l-2 border-primary"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar className="h-8 w-8 border border-white/10 shrink-0 rounded-xs">
                                <AvatarImage src={memberAvatar} />
                                <AvatarFallback className="bg-[#18181B] text-[10px] text-zinc-300 font-sans font-bold rounded-xs">
                                  {memberName[0]?.toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                  {memberName}
                                </p>
                                {memberEmail && (
                                  <p className="text-[11px] text-zinc-500 truncate font-sans">
                                    {memberEmail}
                                  </p>
                                )}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="h-5 w-5 rounded-xs bg-primary/20 border border-primary flex items-center justify-center shrink-0 ml-2">
                                <Check className="h-3.5 w-3.5 text-primary" />
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                );
              }}
            />
            {errors.user_id && (
              <p className="text-[11px] text-red-400 font-sans mt-1">
                {errors.user_id.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Assign Project Role{" "}
              <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <Input
              {...register("project_role")}
              placeholder="e.g. Lead Designer, Backend Developer"
              className="h-9 border-white/10 bg-black text-white text-xs rounded-xs focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40"
            />

            <div className="pt-1">
              <span className="text-[10px] text-zinc-500 block mb-1.5 font-sans">
                Quick Role Templates:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROJECT_ROLE_EXAMPLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      setValue("project_role", role, { shouldValidate: true })
                    }
                    className="px-2 py-0.5 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-[10px] text-zinc-300 rounded-xs transition-colors"
                  >
                    + {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t bg-transparent border-white/10 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="h-9 px-4 border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white text-xs rounded-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || !selectedUserId}
              className="h-9 px-5 bg-primary text-black hover:bg-primary/90 text-xs font-semibold rounded-xs gap-2 disabled:opacity-40"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Confirm & Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
