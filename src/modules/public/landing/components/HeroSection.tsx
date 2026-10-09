import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Check } from "lucide-react";
import vurnDash from "@/assets/vurn_dash.png";

export function HeroSection() {
  return (
    <section className="relative px-6 pt-12 pb-20 md:pt-20 md:pb-28 max-w-7xl mx-auto w-full font-mono">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-sans leading-[1.1]">
              Where Engineering Teams Build{" "}
              <span className="text-amber-500">Better</span> Software.
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
              Plan projects, manage sprints, track issues and collaborate in one
              AI-native engineering workspace designed for modern development
              teams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/register">
              <Button
                type="button"
                className="h-11 px-6 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs cursor-pointer"
              >
                Start for Free
              </Button>
            </Link>

            <Link to="/docs">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-6 border-white/10 bg-[#0C0C0E] text-xs text-zinc-300 hover:text-white rounded-xs cursor-pointer gap-2"
              >
                <Play className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>View Docs</span>
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-500 stroke-3" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-500 stroke-3" />
              <span>100 Free AI Credits for Every Organization</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="border h-100 border-white/10 rounded-xs bg-[#0C0C0E] p-1 shadow-2xl overflow-hidden aspect-16/10 flex items-center justify-center relative group w-2xl">
            <div className="absolute inset-0 bg-linear-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            <img
              src={vurnDash}
              alt="Vurn Dashboard Preview"
              className="w-full h-full object-contain rounded-xs"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
