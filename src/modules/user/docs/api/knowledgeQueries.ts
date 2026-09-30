import { useQuery } from "@tanstack/react-query";
import type { DocumentFoldersQueryParams } from "../types";
import { fetchDocumentFolders } from "./docsApi";

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
