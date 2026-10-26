const SECTIONS = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "accounts", label: "2. Account Registration & Security" },
  { id: "workspaces", label: "3. Organizations & Workspaces" },
  { id: "ai-credits", label: "4. AI Credits & Usage Policy" },
  { id: "intellectual-property", label: "5. Intellectual Property & Data" },
  { id: "acceptable-use", label: "6. Acceptable Use Policy" },
  { id: "termination", label: "7. Termination & Suspension" },
  { id: "limitation", label: "8. Limitation of Liability" },
  { id: "contact", label: "9. Contact Information" },
];

export function TermsToc() {
  return (
    <div className="border border-white/10 rounded-xs bg-[#0C0C0E] p-6 space-y-4 font-mono">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
        Table of Contents
      </h3>
      <nav className="space-y-2">
        {SECTIONS.map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            className="block text-xs text-zinc-400 hover:text-primary transition-colors font-sans py-1"
          >
            {sec.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
