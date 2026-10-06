import { FileText, Loader2, Save, Edit3, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KnowledgeToolbarProps {
  document: any;
  isLoading: boolean;
  isEditing: boolean;
  isUpdating: boolean;
  onToggleEdit: (editing: boolean) => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onOpenDelete: () => void;
}

export function KnowledgeToolbar({
  document,
  isLoading,
  isEditing,
  isUpdating,
  onToggleEdit,
  onCancelEdit,
  onSave,
  onOpenDelete,
}: KnowledgeToolbarProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#09090B]">
      <div className="flex items-center gap-2.5 min-w-0">
        <FileText className="h-4 w-4 text-amber-500 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
          {document ? document.title : "Loading Document..."}
        </span>
      </div>

      {document && !isLoading && (
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancelEdit}
                className="h-8 text-xs border-white/10 bg-black text-zinc-400 hover:text-white rounded-xs cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 mr-1" /> Preview
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isUpdating}
                onClick={onSave}
                className="h-8 text-xs bg-amber-500 text-black hover:bg-amber-400 font-semibold rounded-xs cursor-pointer disabled:opacity-50"
              >
                {isUpdating && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                )}
                <Save className="h-3.5 w-3.5 mr-1" /> Save
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onToggleEdit(true)}
                className="h-8 text-xs border-white/10 bg-black text-zinc-300 hover:text-white rounded-xs cursor-pointer"
              >
                <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenDelete}
                className="h-8 text-xs border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xs cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
