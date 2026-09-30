import api from "@/api/axios";
import type {
  CreateDocumentFolderPayload,
  CreateDocumentFolderResponse,
  DocumentFoldersQueryParams,
  DocumentFoldersResponse,
} from "../types";

export async function fetchDocumentFolders(
  subdomain: string,
  projectSlug: string,
  params?: DocumentFoldersQueryParams,
): Promise<DocumentFoldersResponse> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/document-folders/`,
    { params },
  );
  return data;
}

export async function createDocumentFolder({
  subdomain,
  projectSlug,
  payload,
}: {
  subdomain: string;
  projectSlug: string;
  payload: CreateDocumentFolderPayload;
}): Promise<CreateDocumentFolderResponse> {
  const { data } = await api.post(
    `/organizations/${subdomain}/projects/${projectSlug}/document-folders/`,
    payload,
  );
  return data;
}
