import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  FileText,
  Loader2,
  Save,
  Edit3,
  Eye,
  Trash2,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KnowledgeHeader } from "./KnowledgeHeader";
import { DeleteDocumentModal } from "./modal/DeleteDocumentModal";
import { useDocumentDetail } from "../api/knowledgeQueries";
import {
  useUpdateProjectDocument,
  useDeleteProjectDocument,
} from "../api/knowledgeMutations";
import { useModal } from "@/hooks/useModal";
import { formatRelativeTime } from "@/utils/sprintHelpers";

interface KnowledgeMainContentProps {
  subdomain: string;
  projectSlug: string;
  selectedFolderId: number | null;
  selectedDocumentId: number | null;
  onDocumentDeleted?: () => void;
}

export function KnowledgeMainContent({
  subdomain,
  projectSlug,
  selectedFolderId,
  selectedDocumentId,
  onDocumentDeleted,
}: KnowledgeMainContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  const deleteModal = useModal();

  const {
    data: document,
    isLoading,
    isError,
    error,
  } = useDocumentDetail(subdomain, projectSlug, selectedDocumentId);

  const { mutate: updateDocument, isPending: isUpdating } =
    useUpdateProjectDocument(subdomain, projectSlug, selectedDocumentId);

  const { mutate: deleteDocument, isPending: isDeleting } =
    useDeleteProjectDocument(subdomain, projectSlug, selectedDocumentId);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Strike,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Write documentation content here...",
      }),
    ],
    content: "",
    editable: isEditing,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-hidden min-h-72 text-xs font-sans text-zinc-200",
      },
    },
  });

  useEffect(() => {
    if (document && editor) {
      setTitle(document.title);
      if (editor.getHTML() !== document.content) {
        editor.commands.setContent(document.content || "");
      }
      editor.setEditable(isEditing);
    }
  }, [document, editor, isEditing]);

  if (!selectedFolderId) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#060608]">
        <KnowledgeHeader />
        <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-600 text-xs">
          Select a folder from the sidebar to view documents.
        </div>
      </div>
    );
  }

  if (!selectedDocumentId) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-[#060608]">
        <KnowledgeHeader />
        <div className="flex-1 flex items-center justify-center p-8 text-center text-zinc-600 text-xs">
          Select a document from the sidebar to view content.
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (!selectedDocumentId || !editor) return;
    updateDocument(
      { title: title.trim(), content: editor.getHTML() },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteDocument(undefined, {
      onSuccess: () => {
        deleteModal.closeModal();
        if (onDocumentDeleted) {
          onDocumentDeleted();
        }
      },
    });
  };

  const isNotFound = (error as any)?.response?.status === 404;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#060608] font-mono">
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#09090B]">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileText className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-white truncate">
            {document ? document.title : "Loading Document..."}
          </span>
        </div>

        {document && !isLoading && !isNotFound && (
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTitle(document.title);
                    editor?.commands.setContent(document.content || "");
                    setIsEditing(false);
                  }}
                  className="h-8 text-xs border-white/10 bg-black text-zinc-400 hover:text-white rounded-xs cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={isUpdating}
                  onClick={handleSave}
                  className="h-8 text-xs bg-amber-500 text-black hover:bg-amber-400 font-semibold rounded-xs cursor-pointer disabled:opacity-50"
                >
                  {isUpdating && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                  )}
                  <Save className="h-3.5 w-3.5 mr-1" /> Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 text-xs border-white/10 bg-black text-zinc-300 hover:text-white rounded-xs cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={deleteModal.openModal}
                  className="h-8 text-xs border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xs cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="py-24 flex items-center justify-center text-xs text-zinc-500 gap-1.5">
            <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
            <span>Loading document editor...</span>
          </div>
        ) : isNotFound ? (
          <div className="h-64 border border-dashed border-white/10 rounded-xs flex items-center justify-center text-center p-6 text-zinc-500 text-xs">
            Select a document from the sidebar to view content.
          </div>
        ) : isError || !document ? (
          <div className="h-64 border border-red-500/20 bg-red-500/5 rounded-xs flex items-center justify-center text-center p-6 text-red-400 text-xs">
            Failed to load document.
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4 bg-[#09090B] border border-white/10 p-6 rounded-xs">
            <div className="border-b border-white/10 pb-4 space-y-3">
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document Title"
                  className="h-10 bg-black border-white/10 text-white font-bold text-base rounded-xs"
                />
              ) : (
                <h1 className="text-lg font-bold text-white">
                  {document.title}
                </h1>
              )}
              <p className="text-[11px] text-zinc-500">
                Created by {document.created_by_name} • Updated{" "}
                {formatRelativeTime(document.updated_at)}
              </p>
            </div>

            {isEditing && editor && (
              <div className="flex items-center gap-1 p-1 bg-black border border-white/10 rounded-xs flex-wrap">
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
                <div className="h-4 w-px bg-white/10 mx-1" />
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
                <div className="h-4 w-px bg-white/10 mx-1" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
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
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
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
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
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
                <div className="h-4 w-px bg-white/10 mx-1" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
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
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
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
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={`p-1.5 rounded-xs text-xs ${
                    editor.isActive({ textAlign: "right" })
                      ? "bg-white/20 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </button>
                <div className="h-4 w-px bg-white/10 mx-1" />
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

            <div
              className={`p-4 bg-black border border-white/10 rounded-xs min-h-72 ${!isEditing ? "pointer-events-none select-text" : ""}`}
            >
              <EditorContent editor={editor} />
            </div>
          </div>
        )}
      </div>

      <DeleteDocumentModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.closeModal}
        onConfirm={handleDelete}
        isPending={isDeleting}
        documentTitle={document?.title || "Document"}
      />
    </div>
  );
}
