import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PricingHero() {
  return (
    <section className="relative px-6 pt-24 pb-12 md:pt-32 md:pb-16 max-w-8xl mx-35 text-center font-mono">
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white font-sans leading-[1.1]">
          Scalable Infrastructure with Simple AI Costs
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-2xl mx-auto">
          Pay only for AI usage. Everything else is completely free.
        </p>
        <div className="pt-2">
          <Link to="/register">
            <Button
              type="button"
              className="h-11 px-8 bg-primary text-black hover:bg-primary/90 font-semibold text-xs rounded-xs cursor-pointer"
            >
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
