import { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { useFaqs } from "../api/docsQueries";
import type { FaqItem } from "../types";

export function HelpFaqList() {
  const { data, isLoading } = useFaqs();
  const [openId, setOpenId] = useState<string | null>(null);

  const faqs = data?.results || [];

  if (isLoading) {
    return (
      <div className="py-10 flex items-center justify-center gap-2 text-zinc-500 text-xs font-mono">
        <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        <span>Loading FAQs...</span>
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-3 font-mono">
      <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
        FAQ
      </h2>
      <div className="border border-white/10 bg-[#09090B] divide-y divide-white/10 rounded-xs">
        {faqs.map((faq: FaqItem) => {
          const isOpen = openId === faq.id;
          const sanitizedAnswer = DOMPurify.sanitize(faq.answer);

          return (
            <div key={faq.id} className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="text-xs font-medium text-zinc-200 font-sans">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-amber-500" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  className="px-4 pb-4 pt-1 text-xs text-zinc-400 font-sans leading-relaxed border-t border-white/5 bg-black/20 help-content-wrapper space-y-2 [&>p]:mb-2 [&>h3]:text-xs [&>h3]:font-bold [&>h3]:text-zinc-200 [&>h3]:mt-3 [&>h3]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-1 [&>a]:text-amber-400 [&>a]:underline"
                  dangerouslySetInnerHTML={{ __html: sanitizedAnswer }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
