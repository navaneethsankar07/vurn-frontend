import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  FolderPlus,
  ArrowLeft,
  Loader2,
  Calendar as CalendarIcon,
  Pipette,
} from "lucide-react";
import { format, isBefore } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSubdomain } from "@/utils/subdomain";
import { renderOrgIcon } from "@/utils/renderOrgIcon";
import { cn } from "@/lib/utils";
import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "../schemas/createProjectSchema";
import { useCreateProjectMutation } from "../api/projectMutations";
import { PROJECT_ACCENT_COLORS } from "../constants";
import { useProjectOptions } from "../api/projectQueries";

export function CreateProjectPage() {
  const navigate = useNavigate();
  const subdomain = getSubdomain() || "";

  const { data: optionsData, isLoading: isLoadingOptions } =
    useProjectOptions();
  const createProjectMutation = useCreateProjectMutation(subdomain);

  const [startDateObj, setStartDateObj] = useState<Date | undefined>(undefined);
  const [targetDateObj, setTargetDateObj] = useState<Date | undefined>(
    undefined,
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
      icon: "",
      accent_color: "",
      start_date: "",
      target_date: "",
    },
  });

  const selectedIcon = watch("icon");
  const selectedColor = watch("accent_color");

  useEffect(() => {
    if (optionsData) {
      if (optionsData.default_icon) {
        setValue("icon", optionsData.default_icon);
      }
      if (optionsData.default_accent_color) {
        setValue("accent_color", optionsData.default_accent_color);
      }
    }
  }, [optionsData, setValue]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value;
    setValue("name", nameVal, { shouldValidate: true });

    const autoKey = nameVal
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 10);
    setValue("key", autoKey, { shouldValidate: true });
  };

  const handleSelectStartDate = (date: Date | undefined) => {
    setStartDateObj(date);
    const dateStr = date ? format(date, "yyyy-MM-dd") : "";
    setValue("start_date", dateStr, { shouldValidate: true });

    if (date && targetDateObj && isBefore(targetDateObj, date)) {
      setTargetDateObj(undefined);
      setValue("target_date", "", { shouldValidate: true });
    }
  };

  const handleSelectTargetDate = (date: Date | undefined) => {
    setTargetDateObj(date);
    const dateStr = date ? format(date, "yyyy-MM-dd") : "";
    setValue("target_date", dateStr, { shouldValidate: true });
  };

  const onSubmit = (data: CreateProjectFormValues) => {
    const payload = {
      ...data,
      description: data.description || undefined,
      start_date: data.start_date || undefined,
      target_date: data.target_date || undefined,
    };

    createProjectMutation.mutate(payload, {
      onSuccess: (res) => {
        toast.success(`Project "${res.name}" created successfully!`);
        navigate("/projects");
      },
      onError: (err: any) => {
        const errorMsg =
          err?.response?.data?.detail ||
          err?.response?.data?.key?.[0] ||
          "Failed to create project.";
        toast.error(errorMsg);
      },
    });
  };

  const iconsList = optionsData?.icons || [];
  const isCustomColor =
    selectedColor && !PROJECT_ACCENT_COLORS.includes(selectedColor);

  return (
    <div className="bg-black text-white p-6 sm:p-8 lg:p-12 font-mono flex flex-col justify-center py-12">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <Button
            variant="ghost"
            type="button"
            onClick={() => navigate(-1)}
            className="h-9 w-9 p-0 text-gray-400 hover:text-white hover:bg-white/5 rounded-sm shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2.5">
              <FolderPlus className="h-6 w-6 text-primary shrink-0" />
              Create New Project
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Set up a workspace project for your organization.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="border border-white/10 rounded-sm bg-[#0C0C0E] p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("name")}
                  onChange={handleNameChange}
                  placeholder="e.g. Vurn Backend"
                  className="h-11 border-white/10 bg-black/40 text-white placeholder:text-gray-600 rounded-sm text-sm focus-visible:ring-primary/40 px-3.5"
                />
                {errors.name && (
                  <p className="text-xs text-red-400 pt-0.5">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Project Key <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("key")}
                  placeholder="VRN"
                  maxLength={10}
                  className="h-11 border-white/10 bg-black/40 text-white placeholder:text-gray-600 rounded-sm text-sm uppercase focus-visible:ring-primary/40 px-3.5"
                />
                {errors.key && (
                  <p className="text-xs text-red-400 pt-0.5">
                    {errors.key.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                Description
              </label>
              <Textarea
                {...register("description")}
                placeholder="Brief summary of your project..."
                className="min-h-28 border-white/10 bg-black/40 text-white placeholder:text-gray-600 rounded-sm text-sm focus-visible:ring-primary/40 resize-y p-3.5 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Project Icon
                </label>
                {isLoadingOptions ? (
                  <div className="h-10 flex items-center text-gray-500 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading options...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-2.5 border border-white/5 rounded-sm bg-black/20">
                    {iconsList.map((iconKey) => {
                      const isSelected = selectedIcon === iconKey;
                      return (
                        <button
                          key={iconKey}
                          type="button"
                          onClick={() => setValue("icon", iconKey)}
                          title={iconKey}
                          className={`h-9 w-9 rounded-sm border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary scale-105"
                              : "border-white/10 bg-black/40 text-gray-400 hover:text-white hover:bg-white/5"
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
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Accent Color
                </label>
                <div className="flex items-center gap-2.5 flex-wrap p-2.5 border border-white/5 rounded-sm bg-black/20 min-h-14">
                  {PROJECT_ACCENT_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setValue("accent_color", hex)}
                      style={{ backgroundColor: hex }}
                      className={`h-7 w-7 rounded-sm transition-transform ${
                        selectedColor === hex
                          ? "ring-2 ring-white scale-110"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    />
                  ))}
                  <div className="relative flex items-center">
                    <label
                      title="Custom Color Picker"
                      className={cn(
                        "h-7 px-2.5 flex items-center gap-2 border border-white/20 bg-black/60 hover:bg-white/10 rounded-sm cursor-pointer text-xs text-gray-300 hover:text-white transition-all shadow-sm",
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
                          setValue("accent_color", e.target.value)
                        }
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 flex flex-col">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger className="w-full">
                    <Button
                      variant="outline"
                      type="button"
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal border-white/10 bg-black/40 text-sm text-white hover:bg-black/60 hover:text-white rounded-sm px-3.5",
                        !startDateObj && "text-gray-500",
                      )}
                    >
                      <CalendarIcon className="mr-2.5 h-4 w-4 text-gray-400" />
                      {startDateObj ? (
                        format(startDateObj, "PPP")
                      ) : (
                        <span>Pick start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-white/10 bg-[#0C0C0E] text-white"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={startDateObj}
                      onSelect={handleSelectStartDate}
                      className="p-3 pointer-events-auto **:rdp-day_selected:bg-primary! **:rdp-day_selected:text-black! **:rdp-day_selected:font-bold! **:aria-selected:bg-primary! **:aria-selected:text-black! **:aria-selected:font-bold! **:aria-selected:*:text-black!"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                  Target Date
                </label>
                <Popover>
                  <PopoverTrigger className="w-full">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={!startDateObj}
                      className={cn(
                        "w-full h-11 justify-start text-left font-normal border-white/10 bg-black/40 text-sm text-white hover:bg-black/60 hover:text-white rounded-sm px-3.5",
                        !targetDateObj && "text-gray-500",
                        !startDateObj && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <CalendarIcon className="mr-2.5 h-4 w-4 text-gray-400" />
                      {targetDateObj ? (
                        format(targetDateObj, "PPP")
                      ) : (
                        <span>
                          {startDateObj
                            ? "Pick target date"
                            : "Select start date first"}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 border-white/10 bg-[#0C0C0E] text-white"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={targetDateObj}
                      onSelect={handleSelectTargetDate}
                      disabled={(date) =>
                        startDateObj ? isBefore(date, startDateObj) : false
                      }
                      className="p-3 pointer-events-auto [&_button.rdp-day_selected]:bg-primary! [&_button.rdp-day_selected]:text-black! [&_button.rdp-day_selected]:font-bold! [&_td.rdp-day_selected_button]:bg-primary! [&_td.rdp-day_selected_button]:text-black! [&_.rdp-day_selected]:bg-primary! [&_.rdp-day_selected]:text-black! [&_.rdp-day_selected]:font-bold! **:aria-selected:bg-primary! **:aria-selected:text-black! **:aria-selected:font-bold! [&_[aria-selected='true']_button]:text-black!"
                    />
                  </PopoverContent>
                </Popover>
                {errors.target_date && (
                  <p className="text-xs text-red-400 pt-0.5">
                    {errors.target_date.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto h-10 px-5 text-gray-400 hover:text-white hover:bg-white/5 rounded-sm text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="w-full sm:w-auto h-10 px-6 gap-2 bg-transparent border border-primary/80 text-primary hover:text-primary/70 hover:border-primary/60 hover:bg-transparent font-semibold text-xs rounded-sm transition-colors"
            >
              {createProjectMutation.isPending ? (
                <>
                  Creating...
                  <Loader2 className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
