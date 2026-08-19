import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Check, Pipette } from "lucide-react";
import { toast } from "sonner";
import { PERMISSION_GROUPS } from "../../constants";
import { useUpdateOrganizationRole } from "../../api/organizationMutations";
import {
  updateRoleSchema,
  type UpdateRoleFormValues,
} from "../../schemas/updateRoleSchema";
import type {OrganizationRoles } from "../../types";

interface UpdateRoleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  role: OrganizationRoles | null;
}

const COLOR_OPTIONS = [
  "#6366F1",
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#84CC16",
  "#EAB308",
  "#F97316",
  "#EF4444",
  "#EC4899",
  "#A855F7",
];

export function UpdateRoleSheet({
  isOpen,
  onClose,
  subdomain,
  role,
}: UpdateRoleSheetProps) {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { mutate: updateRole, isPending } = useUpdateOrganizationRole();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(updateRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      color: COLOR_OPTIONS[0],
      permissions: [],
    },
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name || "",
        description: role.description || "",
        color: role.color || COLOR_OPTIONS[0],
        permissions: role.permissions || [],
      });
    }
  }, [role, reset]);

  const currentColor = watch("color");
  const selectedPermissions = watch("permissions") || [];

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isRendered || !role) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: UpdateRoleFormValues) => {
    updateRole(
      { subdomain, roleId: role.id, payload: data },
      {
        onSuccess: () => {
          toast.success("Role updated successfully.");
          handleClose();
        },
        onError: (err: any) => {
          const backendErrors = err?.response?.data;

          if (!backendErrors || typeof backendErrors !== "object") {
            toast.error("Failed to update role. Please try again.");
          } else if (backendErrors.detail) {
            toast.error(backendErrors.detail);
          } else if (backendErrors.non_field_errors) {
            const msg = Array.isArray(backendErrors.non_field_errors)
              ? backendErrors.non_field_errors[0]
              : backendErrors.non_field_errors;
            toast.error(msg);
          } else {
            Object.keys(backendErrors).forEach((key) => {
              const fieldKey = key as keyof UpdateRoleFormValues;
              const errorMessage = Array.isArray(backendErrors[key])
                ? backendErrors[key][0]
                : backendErrors[key];

              if (
                fieldKey === "name" ||
                fieldKey === "description" ||
                fieldKey === "color" ||
                fieldKey === "permissions"
              ) {
                setError(fieldKey, { message: errorMessage });
              } else {
                setError("root", { message: errorMessage });
              }
            });
          }
        },
      },
    );
  };

  const togglePermission = (key: string) => {
    const exists = selectedPermissions.includes(key);
    const updated = exists
      ? selectedPermissions.filter((item) => item !== key)
      : [...selectedPermissions, key];
    setValue("permissions", updated, { shouldValidate: true });
  };

  const isCustomColor = !COLOR_OPTIONS.includes(currentColor);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-mono text-white">
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen max-w-md border-l border-white/10 bg-[#09090b] shadow-2xl flex flex-col justify-between transform transition-transform duration-500 ease-in-out ${
            isVisible ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Edit Role</h2>
                <p className="mt-1 text-xs text-gray-400">
                  Update permissions and details for this role.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errors.root && (
              <div className="rounded-[3px] border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {errors.root.message}
              </div>
            )}

            <form
              id="update-role-form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-300">
                  Role Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  placeholder="e.g. Release Manager"
                  className="mt-1.5 w-full rounded-[3px] border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none"
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  {...register("description")}
                  placeholder="Describe what this role can do."
                  className="mt-1.5 w-full resize-none rounded-[3px] border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none"
                />
                {errors.description && (
                  <p className="mt-1 text-[11px] text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-2">
                  Role Color
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex size-6 shrink-0 items-center justify-center">
                        <input
                          type="color"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="absolute inset-0 size-full opacity-0 cursor-pointer z-10"
                        />
                        <div
                          style={{
                            backgroundColor: isCustomColor
                              ? field.value
                              : "transparent",
                          }}
                          className={`size-6 rounded-full border border-dashed border-white/30 flex items-center justify-center transition-transform hover:scale-110 ${
                            isCustomColor
                              ? "ring-2 ring-white ring-offset-2 ring-offset-[#09090b] scale-110 border-none"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {isCustomColor ? (
                            <Check className="size-3.5 text-black stroke-3" />
                          ) : (
                            <Pipette className="size-3" />
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {COLOR_OPTIONS.map((c) => {
                    const isSelected = currentColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          setValue("color", c, { shouldValidate: true })
                        }
                        style={{ backgroundColor: c }}
                        className={`size-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                          isSelected
                            ? "ring-2 ring-white ring-offset-2 ring-offset-[#09090b] scale-110"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        {isSelected && (
                          <Check className="size-3.5 text-black stroke-3" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.color && (
                  <p className="mt-1.5 text-[11px] text-red-400">
                    {errors.color.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-semibold text-gray-300">
                    Permission Groups
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {selectedPermissions.length} enabled
                  </span>
                </div>

                <div className="space-y-3">
                  {PERMISSION_GROUPS.map((group) => {
                    const enabledCount = group.permissions.filter((p) =>
                      selectedPermissions.includes(p.key),
                    ).length;

                    return (
                      <div
                        key={group.category}
                        className="rounded-[3px] border border-white/10 bg-black/30 p-3 space-y-3"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-200">
                          <span className="flex items-center gap-1.5">
                            <span className="text-gray-500">&gt;</span>
                            {group.category}
                          </span>
                          <span className="text-[11px] text-gray-500 font-normal">
                            {enabledCount}/{group.permissions.length}
                          </span>
                        </div>

                        <div className="space-y-2 pt-1 border-t border-white/5">
                          {group.permissions.map((perm) => {
                            const isChecked = selectedPermissions.includes(
                              perm.key,
                            );

                            return (
                              <div
                                key={perm.key}
                                onClick={() => togglePermission(perm.key)}
                                className="flex items-center justify-between cursor-pointer py-1 text-xs hover:text-white"
                              >
                                <span
                                  className={
                                    isChecked ? "text-white" : "text-gray-400"
                                  }
                                >
                                  {perm.label}
                                </span>

                                <button
                                  type="button"
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    isChecked ? "bg-primary" : "bg-white/10"
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block size-3 transform rounded-full bg-black shadow transition duration-200 ease-in-out ${
                                      isChecked
                                        ? "translate-x-3"
                                        : "translate-x-0 bg-gray-400"
                                    }`}
                                  />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.permissions && (
                  <p className="mt-1.5 text-[11px] text-red-400">
                    {errors.permissions.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-[#09090b] p-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-[3px] border border-white/10 px-4 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="update-role-form"
              disabled={isPending}
              className="flex items-center justify-center gap-2 rounded-[3px] bg-primary px-4 py-2 text-xs font-semibold text-black hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
