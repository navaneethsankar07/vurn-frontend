import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Link, Info } from "lucide-react";
import {
  createOrganizationSchema,
  type CreateOrganizationSchema,
} from "../schemas/organizationSchema";
import { useOrganizationOptionsQuery } from "../api/organizationQueries";
import { useCreateOrganizationMutation } from "../api/organizationMutations";
import { OrganizationBrandingSection } from "../components/OrganizationBrandingSection";
import {
  DEFAULT_ORGANIZATION_COLOR,
  DEFAULT_ORGANIZATION_ICON,
  APP_BASE_DOMAIN,
} from "../constants";
import {
  formatSubdomainPreview,
  getOrganizationUrl,
} from "@/utils/organizationUrl";

export function CreateOrganizationPage() {
  const navigate = useNavigate();

  const { data: options, isLoading: optionsLoading } =
    useOrganizationOptionsQuery();
  const createMutation = useCreateOrganizationMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<CreateOrganizationSchema>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      icon: DEFAULT_ORGANIZATION_ICON,
      accent_color: DEFAULT_ORGANIZATION_COLOR,
    },
  });

  const orgName = watch("name");
  const orgSlug = watch("slug");
  const selectedIcon = watch("icon") || DEFAULT_ORGANIZATION_ICON;
  const selectedColor = watch("accent_color") || DEFAULT_ORGANIZATION_COLOR;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setValue("slug", generatedSlug, { shouldValidate: true });
  };

  const onSubmit = (data: CreateOrganizationSchema) => {
    createMutation.mutate(data, {
      onSuccess: (res: any) => {
        const targetSlug = res?.slug || res?.data?.slug || data.slug;
        window.location.href = getOrganizationUrl(targetSlug);
      },
      onError: (error: any) => {
        const fieldErrors = error?.response?.data;
        if (fieldErrors && typeof fieldErrors === "object") {
          Object.keys(fieldErrors).forEach((key) => {
            const msg = Array.isArray(fieldErrors[key])
              ? fieldErrors[key][0]
              : fieldErrors[key];
            setError(key as any, { type: "server", message: msg });
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen  text-white font-mono px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Create Organization
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
            Create a workspace where your team can manage projects, collaborate
            on issues, and organize engineering work.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">
                Organization Name
              </label>
              <input
                type="text"
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e);
                  handleNameChange(e);
                }}
                placeholder="Acme Technologies"
                className="w-full rounded-[3px] border border-white/10 bg-[#09090b] px-3.5 py-2.5 text-xs text-white placeholder-gray-600 outline-none focus:border-white/30 transition-colors"
              />
              {errors.name ? (
                <p className="text-[11px] text-red-400">
                  {errors.name.message}
                </p>
              ) : (
                <p className="text-[11px] text-gray-500">
                  Use your team or company name. You can change it later.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300">
                Slug
              </label>
              <div className="flex rounded-[3px] border border-white/10 bg-[#09090b] overflow-hidden focus-within:border-white/30 transition-colors">
                <input
                  type="text"
                  {...register("slug")}
                  placeholder="acme-technologies"
                  className="w-full bg-transparent px-3.5 py-2.5 text-xs text-white placeholder-gray-600 outline-none min-w-0"
                />
                <span className="flex items-center bg-white/5 px-3 text-xs text-gray-500 border-l border-white/10 select-none whitespace-nowrap shrink-0">
                  .{APP_BASE_DOMAIN}
                </span>
              </div>
              {errors.slug ? (
                <p className="text-[11px] text-red-400">
                  {errors.slug.message}
                </p>
              ) : (
                <p className="text-[11px] text-gray-500">
                  The slug is used for your workspace subdomain and should be
                  unique.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300">
              Description{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Engineering team workspace for backend and frontend workflows."
              className="w-full rounded-[3px] border border-white/10 bg-[#09090b] px-3.5 py-2.5 text-xs text-white placeholder-gray-600 outline-none focus:border-white/30 resize-none transition-colors"
            />
            {errors.description && (
              <p className="text-[11px] text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-[3px] border border-white/10 bg-[#08080a] px-4 py-3 text-xs text-gray-400">
            <Link className="h-4 w-4 text-gray-500 shrink-0" />
            <span>Workspace URL:</span>
            <span className="text-white font-semibold break-all">
              https://{formatSubdomainPreview(orgSlug)}
            </span>
          </div>

          {!optionsLoading && options && (
            <OrganizationBrandingSection
              orgName={orgName}
              selectedIcon={selectedIcon}
              selectedColor={selectedColor}
              availableIcons={options.icons}
              availableColors={options.accent_colors}
              onSelectIcon={(icon) => setValue("icon", icon)}
              onSelectColor={(color) => setValue("accent_color", color)}
            />
          )}

          <div className="rounded-[3px] border border-white/10 bg-[#08080a] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-white font-medium">
              <Info className="h-4 w-4 text-gray-400" />
              <span>What's next?</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              After creating your organization you can:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-1 pl-1">
              <li>Invite team members</li>
              <li>Create projects</li>
              <li>Configure organization roles</li>
              <li>Customize workflows</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-[3px] border border-white/10 bg-[#141416] px-5 py-2.5 text-xs font-medium text-white transition-colors hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-[3px]  border border-[#f59f0b96] px-5 py-2.5 text-xs font-semibold text-[#f59f0bb6] transition-colors hover:bg-amber-500 disabled:opacity-50"
            >
              {createMutation.isPending ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
