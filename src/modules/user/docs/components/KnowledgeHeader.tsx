import { BookOpen } from "lucide-react";

export function KnowledgeHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#09090B] font-mono">
      <div className="flex items-center gap-2.5">
        <BookOpen className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-white">
          Documentation
        </span>
      </div>
    </div>
  );
}
