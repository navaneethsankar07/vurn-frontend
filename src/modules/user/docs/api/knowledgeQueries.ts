import { useQuery } from "@tanstack/react-query";
import type {
  DocumentFoldersQueryParams,
  DocumentsQueryParams,
} from "../types";
import { fetchDocumentFolders, fetchProjectDocuments } from "./docsApi";

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
