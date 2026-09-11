import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { renderOrgIcon } from "@/utils/renderOrgIcon";
import { useCreateWorkflowStatus } from "../../api/projectMutations";
import {
  PRESET_WORKFLOW_COLORS,
  PRESET_WORKFLOW_ICONS,
  STATUS_CATEGORY_OPTIONS,
} from "../../constants";

interface CreateWorkflowStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  projectSlug: string;
  nextPosition?: number;
}

export function CreateWorkflowStatusModal({
  isOpen,
  onClose,
  subdomain,
  projectSlug,
  nextPosition = 0,
}: CreateWorkflowStatusModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("backlog");
  const [color, setColor] = useState("#3B82F6");
  const [selectedIcon, setSelectedIcon] = useState<string>("circle");
  const [position, setPosition] = useState<number>(nextPosition);
  const [isDefault, setIsDefault] = useState(false);
  const [allowFromBacklog, setAllowFromBacklog] = useState(true);
  const [allowIncoming, setAllowIncoming] = useState(true);
  const [allowOutgoing, setAllowOutgoing] = useState(true);

  const { mutate: createStatus, isPending } = useCreateWorkflowStatus(
    subdomain,
    projectSlug,
  );

  const resetForm = () => {
    setName("");
    setCategory("backlog");
    setColor("#3B82F6");
    setSelectedIcon("circle");
    setPosition(nextPosition);
    setIsDefault(false);
    setAllowFromBacklog(true);
    setAllowIncoming(true);
    setAllowOutgoing(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Status name cannot be empty.");
      return;
    }

    const hexPattern = /^#[0-9A-FA-F]{6}$/;
    if (!hexPattern.test(color.trim())) {
      toast.error("Enter a valid hex color (e.g., #3B82F6).");
      return;
    }

    createStatus(
      {
        name: name.trim(),
        category,
        color: color.trim().toUpperCase(),
        icon: selectedIcon || null,
        position: Number(position),
        is_default: isDefault,
        allow_from_backlog: allowFromBacklog,
        allow_incoming: allowIncoming,
        allow_outgoing: allowOutgoing,
      },
      {
        onSuccess: (data: any) => {
          toast.success(
            data?.message || "Workflow status created successfully",
          );
          handleClose();
        },
        onError: (error: any) => {
          const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.category ||
            error?.response?.data?.name?.[0] ||
            error?.response?.data?.color?.[0] ||
            error?.response?.data?.message ||
            error?.response?.data?.detail ||
            error?.message ||
            "Failed to create workflow status";

          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && handleClose()}
    >
      <DialogContent className="bg-[#09090B] w-full sm:max-w-lg border border-white/10 text-white rounded-none font-mono p-6 shadow-2xl space-y-0">
        <DialogHeader className="space-y-1 border-b border-white/10 pb-4">
          <DialogTitle className="text-sm font-bold tracking-tight text-white uppercase flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" />
            Create Workflow Status
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400 font-sans">
            Add a new status step to your project issue pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-300">Status Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. In Review"
              className="h-9 border-white/10 bg-black text-white text-xs rounded-none placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-primary/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Category *</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val ?? "")}
              >
                <SelectTrigger className="h-9 border-white/10 bg-black text-xs text-white rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0C0C0E] border-white/10 text-white text-xs rounded-none">
                  {STATUS_CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-none"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-300">Position</Label>
              <Input
                type="number"
                min={0}
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="h-9 border-white/10 bg-black text-white text-xs rounded-none focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-300">Status Color *</Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                {PRESET_WORKFLOW_COLORS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setColor(preset)}
                    className={`h-6 w-6 border transition-all ${
                      color.toUpperCase() === preset.toUpperCase()
                        ? "border-white scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: preset }}
                  />
                ))}
              </div>
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-6 w-8 p-0 border border-white/10 bg-black cursor-pointer rounded-none"
              />
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#3B82F6"
                className="h-9 w-28 border-white/10 bg-black text-white text-xs rounded-none font-mono focus-visible:ring-1 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-300">Icon</Label>
            <div className="flex flex-wrap gap-1.5 border border-white/10 bg-black p-2">
              {PRESET_WORKFLOW_ICONS.map((iconName) => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={`p-1.5 border transition-colors ${
                    selectedIcon === iconName
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/5 text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {renderOrgIcon(iconName, { className: "h-4 w-4" })}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_default"
                checked={isDefault}
                onCheckedChange={(checked) => setIsDefault(Boolean(checked))}
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black rounded-none"
              />
              <label
                htmlFor="is_default"
                className="text-xs text-zinc-300 cursor-pointer"
              >
                Set as default status for new issues
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="allow_from_backlog"
                checked={allowFromBacklog}
                onCheckedChange={(checked) =>
                  setAllowFromBacklog(Boolean(checked))
                }
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black rounded-none"
              />
              <label
                htmlFor="allow_from_backlog"
                className="text-xs text-zinc-300 cursor-pointer"
              >
                Allow transition directly from backlog
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow_incoming"
                  checked={allowIncoming}
                  onCheckedChange={(checked) =>
                    setAllowIncoming(Boolean(checked))
                  }
                  className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black rounded-none"
                />
                <label
                  htmlFor="allow_incoming"
                  className="text-xs text-zinc-300 cursor-pointer"
                >
                  Allow incoming transitions
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow_outgoing"
                  checked={allowOutgoing}
                  onCheckedChange={(checked) =>
                    setAllowOutgoing(Boolean(checked))
                  }
                  className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-black rounded-none"
                />
                <label
                  htmlFor="allow_outgoing"
                  className="text-xs text-zinc-300 cursor-pointer"
                >
                  Allow outgoing transitions
                </label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t border-white/10 bg-transparent sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="h-8 px-4 border-white/10 bg-black text-zinc-300 hover:bg-white/5 hover:text-white text-xs rounded-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-8 px-4 bg-primary text-black hover:bg-primary/90 text-xs font-semibold rounded-none gap-2 disabled:opacity-40"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Create Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
