import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KnowledgeHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#09090B] font-mono">
      <div className="flex items-center gap-2.5">
        <BookOpen className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          Documentation
        </span>
      </div>

      <Button
        type="button"
        className="h-8 gap-1.5 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs transition-all shadow-sm cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        New Document
      </Button>
    </div>
  );
}
