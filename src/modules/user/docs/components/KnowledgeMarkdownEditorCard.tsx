import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import { FileText, Edit2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KnowledgeMarkdownEditorCardProps {
  document: any;
  isEditing: boolean;
  title: string;
  setTitle: (val: string) => void;
  markdownContent: string;
  setMarkdownContent: (val: string) => void;
}

export function KnowledgeMarkdownEditorCard({
  document,
  isEditing,
  title,
  setTitle,
  markdownContent,
  setMarkdownContent,
}: KnowledgeMarkdownEditorCardProps) {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");

  return (
    <div className="space-y-4 bg-[#09090B] border border-white/10 p-6 rounded-xs w-full font-mono">
      <div className="border-b border-white/10 pb-4 space-y-3">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="h-11 bg-black border-white/10 text-white font-bold text-lg rounded-xs font-sans"
          />
        ) : (
          <h1 className="text-xl font-bold text-white font-sans">
            {document.title}
          </h1>
        )}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-zinc-500">
            Created by {document.created_by_name} • Updated{" "}
            {formatRelativeTime(document.updated_at)}
          </p>
          {isEditing && (
            <div className="flex items-center gap-1 bg-black p-1 border border-white/10 rounded-xs">
              <Button
                type="button"
                size="sm"
                onClick={() => setViewMode("edit")}
                className={`h-7 px-2.5 text-[11px] rounded-xs cursor-pointer ${
                  viewMode === "edit"
                    ? "bg-white/20 text-white"
                    : "bg-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Edit2 className="h-3 w-3 mr-1" /> Markdown Input
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setViewMode("preview")}
                className={`h-7 px-2.5 text-[11px] rounded-xs cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-white/20 text-white"
                    : "bg-transparent text-zinc-400 hover:text-white"
                }`}
              >
                <Eye className="h-3 w-3 mr-1" /> Preview
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 bg-black border border-white/10 rounded-xs min-h-100">
        {isEditing && viewMode === "edit" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-[10px] text-zinc-500 uppercase tracking-wider pb-1 border-b border-white/5">
              <FileText className="h-3 w-3 text-amber-500" />
              <span>Markdown Source Editor (supports #, **, -, etc.)</span>
            </div>
            <Textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              placeholder="# Write your markdown content here..."
              rows={16}
              className="w-full bg-black border-white/10 text-zinc-200 font-mono text-xs p-3 resize-y focus-visible:ring-0 leading-relaxed"
            />
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-sm font-sans text-zinc-200 leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-zinc-900 [&_pre]:p-3 [&_pre]:rounded-xs [&_code]:font-mono [&_code]:text-xs [&_a]:text-amber-400 [&_a]:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent || document.content || "*No content provided.*"}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
