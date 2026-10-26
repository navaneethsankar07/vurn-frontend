import { useState, useEffect } from "react";
import { Link as LinkIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InsertLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
  initialUrl?: string;
}

export function InsertLinkModal({
  isOpen,
  onClose,
  onConfirm,
  initialUrl = "",
}: InsertLinkModalProps) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    setUrl(initialUrl);
  }, [initialUrl, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs font-mono animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#09090B] border border-white/10 rounded-xs shadow-2xl p-5 space-y-4 text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Insert Link
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-xs transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
              Destination URL
            </label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-8 bg-black border-white/10 text-white text-xs rounded-xs font-mono focus-visible:ring-0 focus-visible:border-amber-500"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-7 px-3 border-white/10 bg-transparent text-zinc-400 hover:text-white text-xs rounded-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-7 px-3 bg-amber-500 text-black hover:bg-amber-400 font-semibold text-xs rounded-xs cursor-pointer"
            >
              Apply
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
