import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Archive, Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

const DUMMY_PROJECT = {
  name: "Inference Gateway",
  key: "INF",
  status: "active",
  description:
    "Low-latency routing layer for model inference requests across regions.",
};

export function ProjectHeader() {
  const navigate = useNavigate();
  const { projectSlug } = useParams<{ projectSlug: string }>();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
          <Folder className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {DUMMY_PROJECT.name}
            </h1>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
              {DUMMY_PROJECT.key}
            </span>
            <span className="px-2 py-0.5 text-[10px] rounded-xs capitalize border border-[#22C55E]/40 text-[#22C55E] bg-[#22C55E]/10">
              • {DUMMY_PROJECT.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
            {DUMMY_PROJECT.description}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <Button
          variant="outline"
          onClick={() => navigate(`/projects/${projectSlug}/settings`)}
          className="h-9 gap-1.5 border-white/10 bg-[#0C0C0E] text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Project
        </Button>
        <Button
          variant="outline"
          className="h-9 gap-1.5 border-white/10 bg-[#0C0C0E] text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
          <Archive className="h-3.5 w-3.5" />
          Archive Project
        </Button>
        <Button className="h-9 gap-1.5 bg-transparent border-primary text-primary hover:bg-transparent hover:border-primary/60 hover:text-primary/70 font-semibold text-xs rounded transition-colors">
          <Plus className="h-4 w-4" />
          Create Issue
        </Button>
      </div>
    </div>
  );
}
