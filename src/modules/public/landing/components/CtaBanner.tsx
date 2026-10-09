import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="px-6 py-20 max-w-5xl mx-auto w-full font-mono text-center">
      <div className="border border-white/10 rounded-xs bg-[#0C0C0E] p-10 md:p-16 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="space-y-3 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Build software. Ship faster.
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-md mx-auto">
            The AI-native engineering workspace for modern software teams.
          </p>
        </div>
        <div className="relative z-10 pt-2">
          <Link to="/register">
            <Button
              type="button"
              className="h-11 px-8 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs cursor-pointer"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
