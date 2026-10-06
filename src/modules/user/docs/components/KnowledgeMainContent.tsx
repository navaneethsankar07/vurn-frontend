import { useState, useEffect } from "react";
import { useEditor, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import { Link } from "@tiptap/extension-link";
import { Loader2 } from "lucide-react";
import { KnowledgeHeader } from "./KnowledgeHeader";
import { KnowledgeToolbar } from "./KnowledgeToolbar";
import { KnowledgeEditorCard } from "./KnowledgeEditorCard";
import { DocumentTagsSection } from "./DocumentTagsSection";
import { DocumentAttachmentsSection } from "./DocumentAttachmentsSection";
import { DeleteDocumentModal } from "./modal/DeleteDocumentModal";
import { useDocumentDetail } from "../api/knowledgeQueries";
import {
  useUpdateProjectDocument,
  useDeleteProjectDocument,
} from "../api/knowledgeMutations";
import { useModal } from "@/hooks/useModal";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

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
      TextStyle,
      FontFamily,
      FontSize,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Write documentation content here...",
      }),
    ],
    content: "",
    editable: isEditing,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-hidden min-h-96 text-sm font-sans text-zinc-200",
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
      <KnowledgeToolbar
        document={document}
        isLoading={isLoading}
        isEditing={isEditing}
        isUpdating={isUpdating}
        onToggleEdit={setIsEditing}
        onCancelEdit={() => {
          setTitle(document?.title || "");
          editor?.commands.setContent(document?.content || "");
          setIsEditing(false);
        }}
        onSave={handleSave}
        onOpenDelete={deleteModal.openModal}
      />

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
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <KnowledgeEditorCard
                document={document}
                isEditing={isEditing}
                title={title}
                setTitle={setTitle}
                editor={editor}
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <DocumentTagsSection
                subdomain={subdomain}
                projectSlug={projectSlug}
                documentId={selectedDocumentId}
              />
              <DocumentAttachmentsSection
                subdomain={subdomain}
                projectSlug={projectSlug}
                documentId={selectedDocumentId}
              />
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
