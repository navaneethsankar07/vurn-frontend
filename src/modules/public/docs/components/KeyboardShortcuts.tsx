import { KEYBOARD_SHORTCUTS } from "../docsData";

export function KeyboardShortcuts() {
  return (
    <div className="space-y-4 font-mono">
      <h3 className="text-sm font-bold text-white tracking-wide uppercase">
        Keyboard shortcuts
      </h3>

      <div className="border border-white/10 rounded-xs bg-[#0C0C0E] divide-y divide-white/5 overflow-hidden">
        {KEYBOARD_SHORTCUTS.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 flex items-center justify-between text-xs"
          >
            <span className="text-zinc-300 font-sans">{item.action}</span>
            <div className="flex items-center gap-1">
              {item.keys.map((key, kIdx) => (
                <span
                  key={kIdx}
                  className="px-2 py-0.5 rounded-xs border border-white/10 bg-white/5 text-[10px] text-zinc-400 font-mono"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
