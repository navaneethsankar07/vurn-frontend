import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FAQ_ITEMS } from "../docsData";

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="space-y-4 font-mono">
      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
        FAQ
      </h3>

      <div className="border border-white/10 rounded-xs bg-[#0C0C0E] divide-y divide-white/5 overflow-hidden">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 flex items-center justify-between text-left text-xs font-medium text-zinc-200 hover:text-white cursor-pointer"
              >
                <span className="font-sans">{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-amber-500 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-zinc-400 font-sans leading-relaxed border-t border-white/5 pt-3 bg-black/40">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
