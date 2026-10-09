import { DOCS_SIDEBAR_LINKS } from "../docsData";

export function DocsSidebar() {
  return (
    <div className="space-y-4 font-mono">
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
        Sections
      </span>
      <nav className="space-y-1">
        {DOCS_SIDEBAR_LINKS.map((link, idx) => (
          <a
            key={idx}
            href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
            className="block text-xs text-zinc-400 hover:text-amber-500 py-1.5 transition-colors font-sans"
          >
            {link}
          </a>
        ))}
      </nav>
    </div>
  );
}
