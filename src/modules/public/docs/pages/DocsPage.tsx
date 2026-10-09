import { useState } from "react";
import { DocsHeader } from "../components/DocsHeader";
import { DocsSidebar } from "../components/DocsSidebar";
import { DocsTopicsGrid } from "../components/DocsTopicsGrid";
import { PopularArticles } from "../components/PopularArticles";
import { KeyboardShortcuts } from "../components/KeyboardShortcuts";
import { FaqSection } from "../components/FaqSection";
import { CtaBanner } from "../../landing/components/CtaBanner";

export function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-full bg-black text-white font-mono">
      <div className="px-6 py-12 md:py-16 max-w-7xl mx-auto w-full space-y-16">
        <DocsHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="hidden lg:block lg:col-span-3 sticky top-6">
            <DocsSidebar />
          </div>

          <div className="lg:col-span-9 space-y-16">
            <DocsTopicsGrid />
            <PopularArticles />
            <KeyboardShortcuts />
            <FaqSection />
          </div>
        </div>
      </div>

      <CtaBanner />
    </div>
  );
}
