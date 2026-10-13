import { useState } from "react";
import { HelpQuickActions } from "../components/HelpQuickActions";
import { HelpTopicView } from "../components/HelpTopicView";

export function HelpCenterPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
console.log('hai');

  return (
    <div className="min-h-full bg-black text-white p-4 sm:p-6 lg:p-0 font-mono">
      <div className="max-w-6xl mx-auto space-y-8">
        {!selectedSlug ? (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <h1 className="text-lg font-bold tracking-tight uppercase text-white">
                Help & Documentation
              </h1>
              <p className="text-xs text-zinc-400 font-sans">
                Learn how to use Vurn and find answers to common questions.
              </p>
            </div>

            <HelpQuickActions onSelectTopic={(slug) => setSelectedSlug(slug)} />
          </div>
        ) : (
          <HelpTopicView
            slug={selectedSlug}
            onBack={() => setSelectedSlug(null)}
          />
        )}
      </div>
    </div>
  );
}
