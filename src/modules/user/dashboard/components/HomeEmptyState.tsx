import { Building2, Plus, Sparkles, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomeEmptyState() {
  const navigate = useNavigate();

  return (
    <div className="border border-white/10 rounded-xs bg-[#09090b] p-8 md:p-12 font-mono space-y-10">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          Welcome to your engineering workspace
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
          You are currently not active in any organizations or projects.
          Establish your first workspace or join an existing one to begin
          tracking issues, organizing sprints, and collaborating with your team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-white/10 bg-[#0C0C0E] p-6 rounded-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-8 w-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              1. Create Organization
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Provision your dedicated workspace subdomain, assign team roles,
              and configure project repositories.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => navigate("/organizations/new")}
            className="h-9 px-4 bg-primary text-black hover:bg-primary/90 font-semibold text-xs rounded-xs cursor-pointer w-full justify-center"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Organization
          </Button>
        </div>

        <div className="border border-white/10 bg-[#0C0C0E] p-6 rounded-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-8 w-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <Terminal className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              2. Track & Plan
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Structure sprint cycles, manage issue backlogs, and monitor team
              velocity.
            </p>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono py-2">
            Configured per workspace
          </div>
        </div>

        <div className="border border-white/10 bg-[#0C0C0E] p-6 rounded-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-8 w-8 rounded bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              3. AI Assistance
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Utilize built-in intelligent tooling for automated task
              breakdowns, story point estimations, and summaries.
            </p>
          </div>
          <div className="text-[11px] text-primary font-mono py-2">
            100 Credits allocated per organization
          </div>
        </div>
      </div>
    </div>
  );
}
