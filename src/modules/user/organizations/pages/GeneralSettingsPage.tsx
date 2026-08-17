import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "lucide-react";
import { toast } from "sonner";
import {
  generalSettingsSchema,
  type GeneralSettingsFormValues,
} from "../schemas/generalSettingsSchema";
import { useOrganizationDetailQuery } from "../api/organizationQueries";
import { useUpdateSettingsMutation } from "../api/organizationMutations";
import { getSubdomain } from "@/utils/subdomain";
import { useAppSelector } from "@/app/hooks";
import { APP_BASE_DOMAIN } from "../constants";
import {
  formatSubdomainPreview,
  getOrganizationUrl,
} from "@/utils/organizationUrl";
import { formatDate } from "@/utils/date";

interface FormOrgData {
  name?: string;
  slug?: string;
  description?: string | null;
  updated_at?: string;
  role?: string;
  total_members?: number;
  total_projects?: number;
}

export function GeneralSettingsPage() {
  const queryClient = useQueryClient();
  const { slug: paramSlug } = useParams<{ slug?: string }>();
  const slug = paramSlug || getSubdomain() || "";

  const { data: orgDetail, isLoading: isOrgLoading } =
    useOrganizationDetailQuery(slug);

  const userOrgs = useAppSelector(
    (state) => state.auth.user?.organizations || [],
  );
  const authOrg = userOrgs.find(
    (o) => o.slug.toLowerCase() === slug.toLowerCase(),
  );

  const data: FormOrgData | null = useMemo(() => {
    if (orgDetail) {
      return {
        name: orgDetail.name,
        slug: orgDetail.slug,
        description: orgDetail.description,
        updated_at: orgDetail.updated_at,
        role: "role" in orgDetail ? String(orgDetail.role) : undefined,
        total_members: orgDetail.total_members,
        total_projects: orgDetail.total_projects,
      };
    }
    if (authOrg) {
      return {
        name: authOrg.name,
        slug: authOrg.slug,
        description: "",
      };
    }
    return null;
  }, [orgDetail, authOrg]);

  const updateSettingsMutation = useUpdateSettingsMutation(slug);
console.log(data);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
    },
  });

  const orgSlug = watch("slug");

  const initialName = data?.name;
  const initialSlug = data?.slug;
  const initialDescription = data?.description;

  useEffect(() => {
    if (data) {
      reset({
        name: initialName || "",
        slug: initialSlug || "",
        description: initialDescription || "",
      });
    }
  }, [initialName, initialSlug, initialDescription, reset]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setValue("slug", generatedSlug, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (values: GeneralSettingsFormValues) => {
    updateSettingsMutation.mutate(values, {
      onSuccess: (res: any) => {
        const updatedSlug = res?.slug || res?.data?.slug || values.slug || slug;

        queryClient.invalidateQueries({ queryKey: ["organization", slug] });
        queryClient.invalidateQueries({ queryKey: ["organizations"] });

        toast.success("Organization settings updated successfully");

        if (updatedSlug.toLowerCase() !== slug.toLowerCase()) {
          setTimeout(() => {
            const baseUrl = getOrganizationUrl(updatedSlug);
            window.location.href = `${baseUrl.replace(/\/$/, "")}/settings/general`;
          }, 1200);
        } else {
          reset(values);
        }
      },
      onError: (error: any) => {
        const errorMsg =
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to update organization settings";
        toast.error(errorMsg);
      },
    });
  };

  if (isOrgLoading && !data) {
    return (
      <div className="p-4 text-xs text-gray-400 font-mono">
        Loading settings...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-xs text-red-400 font-mono">
        Organization details for "{slug}" could not be retrieved.
      </div>
    );
  }

  const displayRole = data.role || "Member";
  const memberCount = data.total_members ?? 0;
  const projectCount = data.total_projects ?? 0;

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 md:pt-6 pb-12 px-4 sm:px-6 md:px-0 space-y-6 font-mono text-xs">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded border border-white/10 bg-[#09090b] p-4 sm:p-5 space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-semibold text-white">General</h2>
            <p className="text-gray-400 text-[11px] mt-0.5">
              Core details that identify your organization across Vurn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1.5 font-medium">
                Organization Name
              </label>
              <input
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  handleNameChange(e);
                }}
                className="w-full bg-[#121215] border border-white/10 rounded-xs px-3 py-2 text-white focus:outline-none focus:border-white/30"
              />
              {errors.name && (
                <p className="text-red-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-1.5 font-medium">
                Slug
              </label>
              <div className="flex rounded-xs border border-white/10 bg-[#121215] overflow-hidden focus-within:border-white/30">
                <input
                  type="text"
                  {...register("slug")}
                  className="w-full bg-transparent px-3 py-2 text-white outline-none min-w-0"
                />
                <span className="flex items-center bg-white/5 px-3 text-xs text-gray-500 border-l border-white/10 select-none whitespace-nowrap shrink-0">
                  .{APP_BASE_DOMAIN}
                </span>
              </div>
              {errors.slug && (
                <p className="text-red-400 mt-1">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1.5 font-medium">
              Organization Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-[#121215] border border-white/10 rounded-xs px-3 py-2 text-white focus:outline-none focus:border-white/30 resize-none"
            />
            {errors.description && (
              <p className="text-red-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-xs border border-white/10 bg-[#08080a] px-3.5 sm:px-4 py-3 text-xs text-gray-400">
            <Link className="h-4 w-4 text-gray-500 shrink-0" />
            <span>Workspace URL:</span>
            <span className="text-white font-semibold break-all">
              https://{formatSubdomainPreview(orgSlug || "")}
            </span>
          </div>
        </div>

        <div className="rounded-xs border border-white/10 bg-[#09090b] p-4 sm:p-5 space-y-3">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-sm font-semibold text-white">Metadata</h2>
            <p className="text-gray-400 text-[11px] mt-0.5">
              Read-only organization audit details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <span className="text-gray-500 block mb-1">Role</span>
              <span className="text-white font-medium capitalize">
                {displayRole}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">
                Members / Projects
              </span>
              <span className="text-white font-medium">
                {`${memberCount} / ${projectCount}`}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-1">Last Updated At</span>
              <span className="text-white font-medium">{formatDate(data.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={!isDirty || updateSettingsMutation.isPending}
            className="w-full sm:w-auto bg-secondary border-primary border-2 hover:text-primary/70 hover:border-primary/70 disabled:opacity-50 text-primary px-4 py-2 rounded-xs text-xs font-medium transition-colors"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
