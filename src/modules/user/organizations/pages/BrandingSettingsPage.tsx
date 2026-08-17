import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Upload } from "lucide-react";
import {
  brandingSettingsSchema,
  type BrandingSettingsFormValues,
} from "../schemas/brandingSettingsSchema";
import {
  useOrganizationDashboardQuery,
  useOrganizationOptionsQuery,
  organizationKeys,
} from "../api/organizationQueries";
import { useUpdateBrandingMutation } from "../api/organizationMutations";
import { getSubdomain } from "@/utils/subdomain";
import { renderOrgIcon } from "@/utils/renderOrgIcon";

export function BrandingSettingsPage() {
  const queryClient = useQueryClient();
  const { slug: paramSlug } = useParams<{ slug?: string }>();
  const slug = paramSlug || getSubdomain() || "";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: orgData, isLoading: isOrgLoading } =
    useOrganizationDashboardQuery(slug);
  const { data: optionsData, isLoading: isOptionsLoading } =
    useOrganizationOptionsQuery();
  const updateBrandingMutation = useUpdateBrandingMutation(slug);

  const availableIcons = optionsData?.icons || [
    "hexagon",
    "box",
    "rocket",
    "polygon",
    "shield",
    "layers",
    "database",
    "cloud",
    "terminal",
    "code",
    "package",
    "cpu",
    "folder",
    "git-fork",
  ];

  const availableColors = optionsData?.accent_colors || [
    { name: "amber", value: "#f59e0b" },
    { name: "blue", value: "#3b82f6" },
    { name: "green", value: "#10b981" },
    { name: "purple", value: "#a855f7" },
    { name: "red", value: "#ef4444" },
    { name: "teal", value: "#14b8a6" },
    { name: "slate", value: "#64748b" },
  ];

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<BrandingSettingsFormValues>({
    resolver: zodResolver(brandingSettingsSchema),
    defaultValues: {
      accent_color: "#f59e0b",
      icon: "hexagon",
      logo_url: "",
    },
  });

  const selectedIcon = watch("icon") ?? "hexagon";
  const selectedColor = watch("accent_color") ?? "#f59e0b";

  useEffect(() => {
    if (orgData) {
      reset({
        accent_color: orgData.accent_color || "#f59e0b",
        icon: orgData.icon || "hexagon",
        logo_url: orgData.logo_url || "",
      });
      setPreviewUrl(orgData.logo_url || null);
    }
  }, [orgData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("File size must be 1MB or less");
      if (e.target) e.target.value = "";
      return;
    }

    setLogoFile(file);
    setPreviewUrl(URL.createObjectURL(file));

    setValue("logo_url", file.name, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = (values: BrandingSettingsFormValues) => {
    const formData = new FormData();

    if (values.accent_color) {
      formData.append("accent_color", values.accent_color);
    }

    if (values.icon) {
      formData.append("icon", values.icon);
    }

    if (logoFile) {
      formData.append("logo", logoFile);
    } else if (!previewUrl) {
      formData.append("remove_logo", "true");
    }

    updateBrandingMutation.mutate(formData as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: organizationKeys.dashboard(slug),
        });
        queryClient.invalidateQueries({
          queryKey: organizationKeys.detail(slug),
        });

        toast.success("Branding settings updated successfully");
        setLogoFile(null);
        reset(values);
      },
      onError: (error: any) => {
        const errorMsg =
          error?.response?.data?.detail ||
          error?.message ||
          "Failed to update branding settings";
        toast.error(errorMsg);
      },
    });
  };

  const isLoading = isOrgLoading || isOptionsLoading;

  if (isLoading) {
    return (
      <div className="p-4 text-xs text-gray-400 font-mono">
        Loading branding settings...
      </div>
    );
  }

  return (
    <div className="w- max-w-3xl mx-auto pt-4 md:pt-6 pb-12 px-4 sm:px-6 md:px-0 space-y-4 font-mono text-xs">
      <div className="text-gray-400 text-xs">Branding</div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="rounded border border-white/10 bg-[#09090b] p-4 sm:p-5 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xs sm:text-sm font-semibold text-white">
              Organization Branding
            </h2>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Choose a built-in mark or upload a custom logo for your
              organization.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 rounded border border-white/10 bg-[#0d0d10] p-3 sm:p-3.5">
            <div
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded border shrink-0 transition-colors overflow-hidden"
              style={{
                borderColor: `${selectedColor}40`,
                backgroundColor: `${selectedColor}15`,
                color: selectedColor,
              }}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                renderOrgIcon(selectedIcon, { className: "h-5 w-5" })
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-medium text-white truncate">
                {orgData?.name || "Organization Name"}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-500">
                Live organization preview
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-200">
                Choose a built-in icon
              </label>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-9 gap-1.5 sm:gap-2 pt-0.5">
              {availableIcons.map((iconName) => {
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setLogoFile(null);
                      setValue("icon", iconName, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setValue("logo_url", null, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                    className={`flex h-9 sm:h-10 w-full items-center justify-center rounded border transition-all ${
                      isSelected && !previewUrl
                        ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
                        : "border-white/10 bg-[#121215] text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {renderOrgIcon(iconName, {
                      className: "h-3.5 w-3.5 sm:h-4 sm:w-4",
                    })}
                  </button>
                );
              })}
            </div>
            {errors.icon && (
              <p className="text-red-400 text-[11px] mt-1">
                {errors.icon.message}
              </p>
            )}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2.5">
            <label className="text-xs font-medium text-gray-200 block">
              Accent Color
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5">
              {availableColors.map((color) => {
                const isSelected = selectedColor === color.value;
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() =>
                      setValue("accent_color", color.value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    style={
                      isSelected
                        ? {
                            borderColor: `${color.value}80`,
                            backgroundColor: `${color.value}20`,
                            color: color.value,
                          }
                        : {}
                    }
                    className={`flex items-center gap-1.5 rounded border px-2.5 py-1.5 text-[11px] sm:text-xs transition-all ${
                      isSelected
                        ? "font-medium"
                        : "border-white/10 bg-[#121215] text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {/* <span
                      className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: color.value }}
                    /> */}
                    <span className="capitalize">{color.name}</span>
                    {isSelected && (
                      <Check
                        className="h-3 w-3 shrink-0"
                        style={{ color: color.value }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.accent_color && (
              <p className="text-red-400 text-[11px] mt-1">
                {errors.accent_color.message}
              </p>
            )}
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-200">
                Upload Custom Logo
              </label>
            </div>

            <div className="pt-0.5 flex flex-wrap items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleFileChange}
                onClick={(e) => {
                  (e.target as HTMLInputElement).value = "";
                }}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 bg-[#121215] hover:bg-[#1a1a1e] border border-white/10 text-gray-300 px-2.5 py-1.5 rounded text-xs transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{logoFile ? logoFile.name : "Choose Logo"}</span>
              </button>

              <span className="text-[10px] sm:text-[11px] text-gray-500">
                PNG, JPG or SVG · 1MB max
              </span>
            </div>
            {errors.logo_url && (
              <p className="text-red-400 text-[11px]">
                {errors.logo_url.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 pt-1">
          <span className="text-gray-500 text-[10px] sm:text-[11px] text-center sm:text-left">
            {isDirty || logoFile ? "Unsaved changes" : "All changes saved."}
          </span>
          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setLogoFile(null);
                setPreviewUrl(orgData?.logo_url || null);
                reset({
                  accent_color: orgData?.accent_color || "#f59e0b",
                  icon: orgData?.icon || "hexagon",
                  logo_url: orgData?.logo_url || "",
                });
              }}
              disabled={!isDirty && !logoFile}
              className="text-gray-400 hover:text-white disabled:opacity-30 text-xs px-2.5 py-1 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                (!isDirty && !logoFile) || updateBrandingMutation.isPending
              }
              className="w-full sm:w-auto bg-secondary border-primary border-2 hover:text-primary/70 hover:border-primary/70 disabled:opacity-50 text-primary px-4 py-2 rounded-xs text-xs font-medium transition-colors"
            >
              {updateBrandingMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
