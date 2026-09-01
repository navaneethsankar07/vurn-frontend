import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  inviteMemberSchema,
  type InviteMemberFormData,
} from "../schemas/invitationSchema";
import { useCreateInvitationMutation } from "../api/organizationMutations";
import { useOrganizationRolesQuery } from "../api/organizationQueries";
import { type CreateInvitationResponse } from "../types";

interface InviteMemberModalProps {
  slug: string;
  onClose: () => void;
  onSuccess: (data: CreateInvitationResponse) => void;
}

export function InviteMemberModal({
  slug,
  onClose,
  onSuccess,
}: InviteMemberModalProps) {
  const createMutation = useCreateInvitationMutation(slug);

  const { data: rolesData, isLoading: isLoadingRoles } =
    useOrganizationRolesQuery(slug);
  const roles = rolesData?.results || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      permission_role: "member",
      job_role_id: "",
      personal_message: "",
      send_email: true,
    },
  });

  const sendEmailValue = watch("send_email");

  const onSubmit = (data: InviteMemberFormData) => {
    createMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success("Invitation created successfully");
        onSuccess(res);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.error || "Failed to create invitation.",
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-md border border-white/10 bg-[#0C0C0E] p-5 sm:p-6 shadow-2xl rounded-lg max-h-[90vh] flex flex-col justify-between select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500">
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-white font-mono">
                Invite Member
              </h2>
              <p className="text-xs text-zinc-400">
                Invite someone to join your organization.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-zinc-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 pt-4 select-text"
        >
          <div className="space-y-1.5">
            <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Email Address
            </Label>
            <Input
              type="email"
              placeholder="name@company.com"
              {...register("email")}
              className="h-9 border-white/10 bg-black/40 text-white placeholder:text-zinc-600 focus-visible:ring-amber-500/50 rounded-md text-sm"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Permission Level
              </Label>
              <select
                {...register("permission_role")}
                className="w-full h-9 px-3 border border-white/10 bg-black/40 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 rounded-md text-sm"
              >
                <option value="member" className="bg-[#0C0C0E]">
                  Member
                </option>
                <option value="admin" className="bg-[#0C0C0E]">
                  Admin
                </option>
              </select>
              {errors.permission_role && (
                <p className="text-xs text-red-500">
                  {errors.permission_role.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                Job Role
              </Label>
              <select
                {...register("job_role_id")}
                disabled={isLoadingRoles}
                className="w-full h-9 px-3 border border-white/10 bg-black/40 text-white focus:outline-none focus:ring-1 focus:ring-amber-500/50 rounded-md text-sm disabled:opacity-50"
              >
                <option value="" className="bg-[#0C0C0E] text-zinc-500">
                  {isLoadingRoles ? "Loading roles..." : "Select job role..."}
                </option>
                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                    style={{ color: role.color || "#F59E0B" }}
                    className="bg-[#0C0C0E]"
                  >
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.job_role_id && (
                <p className="text-xs text-red-500">
                  {errors.job_role_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Personal Message */}
          <div className="space-y-1.5">
            <Label className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Personal Message <span className="text-zinc-600">(optional)</span>
            </Label>
            <textarea
              placeholder="Add a note to the invitation..."
              rows={3}
              {...register("personal_message")}
              className="w-full p-2.5 border border-white/10 bg-black/40 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 rounded-md text-sm resize-none"
            />
          </div>

          {/* Send Email Checkbox */}
          <div className="flex items-center space-x-2 pt-1 select-none">
            <Checkbox
              id="send_email"
              checked={Boolean(sendEmailValue)}
              onCheckedChange={(checked) =>
                setValue("send_email", Boolean(checked))
              }
              className="h-4 w-4 rounded border-white/20 bg-black/40 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 [&>span>svg]:text-black [&>span>svg]:stroke-3 focus-visible:ring-amber-500/50"
            />
            <label
              htmlFor="send_email"
              className="text-xs font-mono text-zinc-300 cursor-pointer select-none"
            >
              Send invitation email automatically
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="w-full sm:w-auto h-9 px-4 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full sm:w-auto h-9 px-4 gap-2 bg-amber-500 text-zinc-950 font-semibold hover:bg-amber-500/90 rounded-md text-xs font-mono transition-colors"
            >
              {createMutation.isPending ? (
                <>
                  Sending...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Send Invitation"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
