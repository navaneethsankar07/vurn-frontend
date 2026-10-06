import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Link as LinkIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/utils/sprintHelpers";
import { InsertLinkModal } from "./modal/InsertLinkModal";

interface KnowledgeEditorCardProps {
  document: any;
  isEditing: boolean;
  title: string;
  setTitle: (val: string) => void;
  editor: any;
}

export function KnowledgeEditorCard({
  document,
  isEditing,
  title,
  setTitle,
  editor,
}: KnowledgeEditorCardProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleOpenLinkModal = () => {
    if (!editor) return;
    setIsLinkModalOpen(true);
  };

  const handleApplyLink = (url: string) => {
    if (!editor) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const currentLinkUrl = editor ? editor.getAttributes("link").href || "" : "";

  return (
    <div className="space-y-4 bg-[#09090B] border border-white/10 p-6 rounded-xs w-full">
      <div className="border-b border-white/10 pb-4 space-y-3">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title"
            className="h-11 bg-black border-white/10 text-white font-bold text-lg rounded-xs"
          />
        ) : (
          <h1 className="text-xl font-bold text-white">{document.title}</h1>
        )}
        <p className="text-[11px] text-zinc-500">
          Created by {document.created_by_name} • Updated{" "}
          {formatRelativeTime(document.updated_at)}
        </p>
      </div>

      {isEditing && editor && (
        <div className="flex items-center gap-1.5 p-1 bg-black border border-white/10 rounded-xs flex-wrap">
          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val) editor.chain().focus().setFontFamily(val).run();
              else editor.chain().focus().unsetFontFamily().run();
            }}
            defaultValue=""
            className="h-7 bg-[#09090B] border border-white/10 text-zinc-300 text-[11px] rounded-xs px-1 font-mono focus:outline-hidden cursor-pointer"
          >
            <option value="" disabled>
              Font
            </option>
            <option value="sans-serif">Sans</option>
            <option value="serif">Serif</option>
            <option value="monospace">Mono</option>
          </select>

          <select
            onChange={(e) => {
              const val = e.target.value;
              if (val) editor.chain().focus().setFontSize(val).run();
              else editor.chain().focus().unsetFontSize().run();
            }}
            defaultValue=""
            className="h-7 bg-[#09090B] border border-white/10 text-zinc-300 text-[11px] rounded-xs px-1 font-mono focus:outline-hidden cursor-pointer"
          >
            <option value="" disabled>
              Size
            </option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
            <option value="30px">30px</option>
          </select>

          <div className="h-4 w-px bg-white/10 mx-0.5" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("bold")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("italic")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("underline")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("strike")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Strikethrough className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("highlight")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Highlighter className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenLinkModal}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("link")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </button>

          <div className="h-4 w-px bg-white/10 mx-0.5" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("heading", { level: 1 })
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Heading1 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("heading", { level: 2 })
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("heading", { level: 3 })
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Heading3 className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-white/10 mx-0.5" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("bulletList")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("orderedList")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("blockquote")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Quote className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive("codeBlock")
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Code className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-white/10 mx-0.5" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive({ textAlign: "left" })
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <AlignLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive({ textAlign: "center" })
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <AlignCenter className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded-xs text-xs ${
              editor.isActive({ textAlign: "right" })
                ? "bg-white/20 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <AlignRight className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-white/10 mx-0.5" />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded-xs text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="p-5 bg-black border border-white/10 rounded-xs min-h-96">
        <EditorContent
          editor={editor}
          className="[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-zinc-900 [&_pre]:p-3 [&_pre]:rounded-xs [&_code]:font-mono [&_code]:text-xs [&_a]:text-amber-400 [&_a]:underline"
        />
      </div>

      <InsertLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onConfirm={handleApplyLink}
        initialUrl={currentLinkUrl}
      />
    </div>
  );
}
