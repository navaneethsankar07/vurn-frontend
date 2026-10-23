import { TermsHero } from "../components/TermsHero";
import { TermsToc } from "../components/TermsToc";
import { TermsContent } from "../components/TermsContent";

export function TermsPage() {
  return (
    <div className="flex pt-25 flex-col h-[calc(100vh-5rem)] bg-black text-white overflow-hidden">
      <TermsHero />
      <div className="flex-1 min-h-0 px-6 py-6 max-w-8xl mx-35 font-mono w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
          <div className="hidden lg:block lg:col-span-2 h-full overflow-y-auto pr-2">
            <TermsToc />
          </div>

          <div className="lg:col-span-9 h-full overflow-y-auto border border-white/10 rounded-xs bg-[#0C0C0E] p-8 md:p-12">
            <TermsContent />
          </div>
        </div>
      </div>
    </div>
  );
}
