import { KEYBOARD_SHORTCUTS } from "../constants";
import { formatKey } from "../utils/platform";

export function KeyboardShortcutsPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-mono text-white space-y-8">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Keyboard Shortcuts
        </h1>
        <p className="text-xs text-gray-400">
          Speed up your workflow using Vurn keyboard shortcuts.
        </p>
      </div>

      <div className="space-y-8">
        {KEYBOARD_SHORTCUTS.map((group) => (
          <div key={group.category} className="space-y-3">
            <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {group.category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.shortcuts.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-4 bg-[#09090B] border border-white/10 rounded-[3px] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-1">
                      {item.keyDisplay.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className="px-2 py-1 bg-white/5 border border-white/10 rounded-[3px] text-[10px] text-gray-300 font-mono"
                        >
                          {formatKey(k)}
                        </kbd>
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-[11px] text-gray-500 italic">
          More shortcuts will be added in future releases.
        </p>
      </div>
    </div>
  );
}
