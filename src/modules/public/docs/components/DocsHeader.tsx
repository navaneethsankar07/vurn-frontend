import { Search } from "lucide-react";

interface DocsHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function DocsHeader({ searchQuery, onSearchChange }: DocsHeaderProps) {
  return (
    <div className="text-center space-y-4 pb-12 border-b border-white/5 font-mono">
      
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
        Documentation
      </h1>
      <p className="text-xs sm:text-sm text-zinc-400 font-sans">
        Everything you need to start using Vurn.
      </p>

      <div className="max-w-md mx-auto relative pt-2">
        <Search className="absolute left-3.5 top-5 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#0C0C0E] border border-white/10 rounded-xs pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-amber-500/50"
        />
      </div>
    </div>
  );
}
