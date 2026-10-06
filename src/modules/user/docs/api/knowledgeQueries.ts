import { useQuery } from "@tanstack/react-query";
import type {
  DocumentFoldersQueryParams,
  DocumentsQueryParams,
} from "../types";
import {
  fetchDocumentAttachments,
  fetchDocumentDetail,
  fetchDocumentFolders,
  fetchDocumentTags,
  fetchProjectDocuments,
  fetchTagSuggestions,
} from "./docsApi";
import { toast } from "sonner";

export function useDocumentFolders(
  subdomain: string,
  projectSlug: string,
  params?: DocumentFoldersQueryParams,
) {
  return useQuery({
    queryKey: ["document-folders", subdomain, projectSlug, params],
    queryFn: () => fetchDocumentFolders(subdomain, projectSlug, params),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useProjectDocuments(
  subdomain: string,
  projectSlug: string,
  params?: DocumentsQueryParams,
) {
  return useQuery({
    queryKey: ["documents", subdomain, projectSlug, params],
    queryFn: () => fetchProjectDocuments(subdomain, projectSlug, params),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useDocumentDetail(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  return useQuery({
    queryKey: ["document", subdomain, projectSlug, documentId],
    queryFn: () => fetchDocumentDetail(subdomain, projectSlug, documentId!),
    enabled: Boolean(subdomain && projectSlug && documentId),
    meta: {
      onError: (error: any) => {
        const status = error?.response?.status;
        if (status === 403) {
          toast.error("You don't have permission to view the knowledge base.");
        } else if (status === 404) {
          toast.error("Document not found.");
        } else {
          toast.error("Failed to load document details.");
        }
      },
    },
  });
}

export function useDocumentTags(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  return useQuery({
    queryKey: ["document-tags", subdomain, projectSlug, documentId],
    queryFn: () => fetchDocumentTags(subdomain, projectSlug, documentId),
    enabled: Boolean(subdomain && projectSlug && documentId),
  });
}

export function useTagSuggestions(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  return useQuery({
    queryKey: ["tag-suggestions", subdomain, projectSlug, documentId],
    queryFn: () => fetchTagSuggestions(subdomain, projectSlug, documentId),
    enabled: Boolean(subdomain && projectSlug && documentId),
  });
}

export function useDocumentAttachments(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  return useQuery({
    queryKey: ["document-attachments", subdomain, projectSlug, documentId],
    queryFn: () => fetchDocumentAttachments(subdomain, projectSlug, documentId),
    enabled: Boolean(subdomain && projectSlug && documentId),
  });
}
