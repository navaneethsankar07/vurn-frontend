import { HeroSection } from "../components/HeroSection";
import { FeaturesGrid } from "../components/FeaturesGrid";
import { CtaBanner } from "../components/CtaBanner";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-full bg-black text-white">
      <HeroSection />
      <FeaturesGrid />
      <CtaBanner />
    </div>
  );
}
