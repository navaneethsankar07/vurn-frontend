import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FeaturesHero() {
  return (
    <section className="relative px-6 pt-24 pb-16 md:pt-32 md:pb-20 max-w-8xl mx-35 text-center font-mono">
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-sans leading-[1.1]">
          Everything Your Engineering Team Needs
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-2xl mx-auto">
          Plan projects, manage sprints, track issues and collaborate with your
          team in one AI-native workspace built for modern engineering teams.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/register">
            <Button
              type="button"
              className="h-11 px-6 bg-primary text-black hover:bg-primary/90 font-semibold text-xs rounded-xs cursor-pointer"
            >
              Start for Free
            </Button>
          </Link>
          <Link to="/docs">
            <Button
              type="button"
              variant="outline"
              className="h-11 px-6 border-white/10 bg-[#0C0C0E] hover:bg-white/5 text-xs text-zinc-300 hover:text-white rounded-xs cursor-pointer"
            >
              View Docs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
