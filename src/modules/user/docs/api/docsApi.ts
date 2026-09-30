import api from "@/api/axios";
import type {
  CreateDocumentFolderPayload,
  CreateDocumentFolderResponse,
  CreateDocumentPayload,
  CreateDocumentResponse,
  DocumentDetail,
  DocumentFoldersQueryParams,
  DocumentFoldersResponse,
  DocumentsQueryParams,
  DocumentsResponse,
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

export async function fetchProjectDocuments(
  subdomain: string,
  projectSlug: string,
  params?: DocumentsQueryParams,
): Promise<DocumentsResponse> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/documents/`,
    { params },
  );
  return data;
}

export async function createProjectDocument({
  subdomain,
  projectSlug,
  payload,
}: {
  subdomain: string;
  projectSlug: string;
  payload: CreateDocumentPayload;
}): Promise<CreateDocumentResponse> {
  const { data } = await api.post(
    `/organizations/${subdomain}/projects/${projectSlug}/documents/`,
    payload,
  );
  return data;
}

export async function fetchDocumentDetail(
  subdomain: string,
  projectSlug: string,
  documentId: number | string,
): Promise<DocumentDetail> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/documents/${documentId}/`,
  );
  return data;
}
