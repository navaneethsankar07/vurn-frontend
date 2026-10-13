import { useNavigate } from "react-router-dom";
import { BookOpen, Keyboard, LifeBuoy, Bug, Lightbulb } from "lucide-react";

export function HelpFooterSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 font-mono pt-4">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        Need More Help?
      </h2>

      <div className="bg-[#09090B] border border-white/10 rounded-xs p-5 space-y-4">
        <div className="space-y-1">
          <span className="font-bold text-xs text-white uppercase block font-sans">
            Self-service support
          </span>
          <p className="text-[11px] text-zinc-400 font-sans">
            Browse available guides, shortcuts and upcoming support channels.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <button
            type="button"
            onClick={() => navigate("/documentation")}
            className="flex flex-col justify-between p-3.5 bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/30 transition-colors cursor-pointer rounded-xs text-left group h-18"
          >
            <BookOpen className="h-4 w-4 text-zinc-400 group-hover:text-white" />
            <span className="font-bold text-zinc-300 group-hover:text-white font-sans text-xs">
              Documentation
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/shortcuts")}
            className="flex flex-col justify-between p-3.5 bg-black/40 border border-white/10 hover:border-white/30 hover:bg-black/30 transition-colors cursor-pointer rounded-xs text-left group h-18"
          >
            <Keyboard className="h-4 w-4 text-zinc-400 group-hover:text-white" />
            <span className="font-bold text-zinc-300 group-hover:text-white font-sans text-xs">
              Keyboard Shortcuts
            </span>
          </button>

          <div className="flex flex-col justify-between p-3.5 bg-black/40 border border-white/10 rounded-xs text-left opacity-60 cursor-not-allowed h-18">
            <div className="flex items-center justify-between">
              <LifeBuoy className="h-4 w-4 text-zinc-500" />
              <span className="text-[9px] uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-xs text-zinc-400 font-mono">
                Coming Soon
              </span>
            </div>
            <span className="font-bold text-zinc-400 font-sans text-xs">
              Contact Support
            </span>
          </div>

          <div className="flex flex-col justify-between p-3.5 bg-black/40 border border-white/10 rounded-xs text-left opacity-60 cursor-not-allowed h-18">
            <div className="flex items-center justify-between">
              <Bug className="h-4 w-4 text-zinc-500" />
              <span className="text-[9px] uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-xs text-zinc-400 font-mono">
                Coming Soon
              </span>
            </div>
            <span className="font-bold text-zinc-400 font-sans text-xs">
              Report Bug
            </span>
          </div>

          <div className="flex flex-col justify-between p-3.5 bg-black/40 border border-white/10 rounded-xs text-left opacity-60 cursor-not-allowed col-span-2 sm:col-span-1 h-18">
            <div className="flex items-center justify-between">
              <Lightbulb className="h-4 w-4 text-zinc-500" />
              <span className="text-[9px] uppercase bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-xs text-zinc-400 font-mono">
                Coming Soon
              </span>
            </div>
            <span className="font-bold text-zinc-400 font-sans text-xs truncate">
              Feature Requests
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
