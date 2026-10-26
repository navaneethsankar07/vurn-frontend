const SECTIONS = [
  { id: "information-collected", label: "1. Information We Collect" },
  { id: "use-of-information", label: "2. How We Use Information" },
  { id: "workspaces-organizations", label: "3. Organizations & Data Sharing" },
  { id: "ai-processing", label: "4. AI & Machine Learning Processing" },
  { id: "data-security", label: "5. Data Security & Encryption" },
  { id: "cookies-tracking", label: "6. Cookies & Tracking Technologies" },
  { id: "data-retention", label: "7. Data Retention & Deletion" },
  { id: "user-rights", label: "8. Your Privacy Rights" },
  { id: "contact-privacy", label: "9. Contact Compliance" },
];

export function PrivacyToc() {
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
