import { PricingHero } from "../components/PricingHero";
import { PricingFreeTier } from "../components/PricingFreeTier";
import { PricingAiCredits } from "../components/PricingAiCredits";
import { PricingFaq } from "../components/PricingFaq";
import { CtaBanner } from "../../landing/components/CtaBanner";

export function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white pt-16 overflow-x-hidden">
      <PricingHero />
      <PricingFreeTier />
      <PricingAiCredits />
      <PricingFaq />
      <CtaBanner />
    </div>
  );
}
