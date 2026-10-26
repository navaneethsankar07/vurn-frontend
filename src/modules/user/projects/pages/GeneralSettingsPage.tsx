import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X, ImageIcon, Loader2, Pipette } from "lucide-react";
import { getSubdomain } from "@/utils/subdomain";
import { renderOrgIcon } from "@/utils/renderOrgIcon";
import { cn } from "@/lib/utils";
import { PROJECT_ACCENT_COLORS } from "../constants";
import { useProjectOptions, useProjectSettings } from "../api/projectQueries";
import {
  projectUpdateSchema,
  type ProjectUpdateFormData,
} from "../schemas/projectSettingsSchema";
import { useUpdateProjectSettings } from "../api/projectMutations";
import { toast } from "sonner";

export function GeneralSettingsPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const subdomain = getSubdomain() || "";
  const navigate = useNavigate();

  const { data: optionsData, isLoading: isLoadingOptions } =
    useProjectOptions();
  const {
    data: projectData,
    isLoading: isLoadingSettings,
    isError,
    error,
  } = useProjectSettings(subdomain, projectSlug || "");

  const [assetType, setAssetType] = useState<"icon" | "logo">("icon");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProjectUpdateFormData>({
    resolver: zodResolver(projectUpdateSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      status: "active",
      icon: "",
      accent_color: "",
      logo: null,
    },
  });

  const selectedIcon = watch("icon");
  const selectedColor = watch("accent_color");

  useEffect(() => {
    if (projectData) {
      reset({
        name: projectData.name || "",
        key: projectData.key || "",
        description: projectData.description || "",
        status: projectData.status || "active",
        icon: projectData.icon || optionsData?.default_icon || "",
        accent_color:
          projectData.accent_color || optionsData?.default_accent_color || "",
        logo: null,
      });

      if (projectData.logo_url) {
        setAssetType("logo");
        setLogoPreview(projectData.logo_url);
      } else {
        setAssetType("icon");
        setLogoPreview(null);
      }
    }
  }, [projectData, optionsData, reset]);

  const { mutate: updateSettings, isPending } = useUpdateProjectSettings({
    subdomain,
    projectSlug: projectSlug || "",
  });

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("logo", file, { shouldDirty: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setValue("logo", null, { shouldDirty: true });
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: ProjectUpdateFormData) => {
    updateSettings(data, {
      onSuccess: (response) => {
        const message =
          response?.message || "Project settings updated successfully.";
        toast.success(message);
        navigate(`/projects`, { replace: true });
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update project settings.";

        toast.error(errorMessage);
      },
    });
  };

  const iconsList = optionsData?.icons || [];
  const isCustomColor =
    selectedColor && !PROJECT_ACCENT_COLORS.includes(selectedColor);

  const getLoadErrorMessage = () => {
    if (!error)
      return "Failed to load project settings. Please try refreshing the page.";

    const axiosError = error as {
      response?: {
        data?: {
          error?: string;
          detail?: string;
          message?: string;
        };
      };
      message?: string;
    };

    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.detail ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to load project settings. Please try refreshing the page."
    );
  };

  if (isLoadingSettings) {
    return (
      <div className="max-w-4xl border border-white/10 bg-[#0C0C0E] rounded-xs p-12 flex items-center justify-center text-xs font-mono text-neutral-400">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-primary" />
        Loading project settings...
      </div>
    );
  }

  if (isError || !projectData) {
    return (
      <div className="max-w-4xl border border-red-500/20 bg-red-500/5 rounded-xs p-6 text-xs font-mono text-red-400">
        {getLoadErrorMessage()}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 font-mono text-white">
      <div className="border border-white/10 bg-[#0C0C0E] rounded-xs p-6 space-y-6">
        <div>
          <h2 className="text-base font-semibold text-white">General</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Basic information and configuration for this project.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="e.g. Authentication"
              className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              Project Key <span className="text-red-500">*</span>
            </label>
            <input
              {...register("key")}
              type="text"
              placeholder="AUTH"
              maxLength={10}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary transition-colors uppercase"
            />
            <p className="text-[11px] text-neutral-500">
              The project key is used when generating issue IDs (e.g. AUTH-142).
            </p>
            {errors.key && (
              <p className="text-xs text-red-400">{errors.key.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              Project Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="What is this project about?"
              className="w-full bg-black/40 border border-white/10 rounded-xs p-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              Project Status
            </label>
            <select
              {...register("status")}
              className="w-full bg-black/40 border border-white/10 rounded-xs px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            >
              <option value="active" className="bg-[#0C0C0E]">
                Active
              </option>
              <option value="completed" className="bg-[#0C0C0E]">
                Completed
              </option>
              <option value="archived" className="bg-[#0C0C0E]">
                Archived
              </option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs text-neutral-400 uppercase tracking-wider font-semibold">
              Project Identity
            </label>

            <div className="flex items-center gap-4 border-b border-white/10 pb-3 pt-3">
              <button
                type="button"
                onClick={() => setAssetType("icon")}
                className={`text-xs pb-1 transition-colors ${
                  assetType === "icon"
                    ? "text-primary border-b-2 border-primary font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Prebuilt Icon
              </button>
              <button
                type="button"
                onClick={() => setAssetType("logo")}
                className={`text-xs pb-1 transition-colors ${
                  assetType === "logo"
                    ? "text-primary border-b-2 border-primary font-medium"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Custom Logo Image
              </button>
            </div>

            {assetType === "icon" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
                    Choose Icon
                  </span>
                  {isLoadingOptions ? (
                    <div className="h-10 flex items-center text-neutral-500 text-xs">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading options...
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-2.5 border border-white/5 rounded-xs bg-black/20">
                      {iconsList.map((iconKey) => {
                        const isSelected = selectedIcon === iconKey;
                        return (
                          <button
                            key={iconKey}
                            type="button"
                            onClick={() =>
                              setValue("icon", iconKey, { shouldDirty: true })
                            }
                            title={iconKey}
                            className={`h-9 w-9 rounded-xs border flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary scale-105"
                                : "border-white/10 bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {renderOrgIcon(iconKey, { className: "h-4 w-4" })}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold block">
                    Accent Color
                  </span>
                  <div className="flex items-center gap-2.5 flex-wrap p-2.5 border border-white/5 rounded-xs bg-black/20 min-h-14">
                    {PROJECT_ACCENT_COLORS.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() =>
                          setValue("accent_color", hex, { shouldDirty: true })
                        }
                        style={{ backgroundColor: hex }}
                        className={`h-7 w-7 rounded-xs transition-transform ${
                          selectedColor === hex
                            ? "ring-2 ring-white scale-110"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      />
                    ))}
                    <div className="relative flex pt-3 items-center">
                      <label
                        title="Custom Color Picker"
                        className={cn(
                          "h-7 px-2.5 flex items-center gap-2 border border-white/20 bg-black/60 hover:bg-white/10 rounded-xs cursor-pointer text-xs text-neutral-300 hover:text-white transition-all shadow-sm",
                          isCustomColor &&
                            "ring-2 ring-white border-transparent text-white bg-black/80",
                        )}
                      >
                        <Pipette className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="font-semibold text-[11px] uppercase tracking-wider">
                          Custom
                        </span>
                        <div
                          className="h-4 w-4 rounded-full border border-white/30 shrink-0 shadow-inner"
                          style={{
                            backgroundColor:
                              selectedColor ||
                              optionsData?.default_accent_color ||
                              "#F59E0B",
                          }}
                        />
                        <input
                          type="color"
                          value={
                            selectedColor ||
                            optionsData?.default_accent_color ||
                            "#F59E0B"
                          }
                          onChange={(e) =>
                            setValue("accent_color", e.target.value, {
                              shouldDirty: true,
                            })
                          }
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {assetType === "logo" && (
              <div className="pt-2 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative group w-16 h-16 rounded-xs border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center">
                      <img
                        src={logoPreview}
                        alt="Project Logo Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black rounded-full text-white transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xs border border-dashed border-white/10 bg-black/40 flex flex-col items-center justify-center text-neutral-500">
                      <ImageIcon className="h-5 w-5 mb-1" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/10 hover:border-white/20 rounded-xs text-xs text-neutral-300 hover:text-white transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload icon</span>
                  </button>
                </div>
                <p className="text-[11px] text-neutral-500">
                  PNG or SVG, up to 1MB. Square images work best.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-white/10 bg-black/40 p-4 rounded-xs">
            <div>
              <span className="text-[11px] text-neutral-500 block">
                Created By
              </span>
              <span className="text-xs font-medium text-neutral-300">
                {projectData.created_by || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">
                Created Date
              </span>
              <span className="text-xs font-medium text-neutral-300">
                {projectData.created_at
                  ? new Date(projectData.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">
                Last Updated
              </span>
              <span className="text-xs font-medium text-neutral-300">
                {projectData.updated_at
                  ? new Date(projectData.updated_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => reset()}
              disabled={!isDirty}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-semibold rounded-xs transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="px-4 py-2 bg-primary hover:opacity-90 disabled:opacity-50 text-black text-xs font-semibold rounded-xs transition-opacity flex items-center justify-center min-w-24"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
