import api from "@/api/axios";
import type {
  CreateDocumentFolderPayload,
  CreateDocumentFolderResponse,
  CreateDocumentPayload,
  CreateDocumentResponse,
  DeleteDocumentResponse,
  DocumentDetail,
  DocumentFoldersQueryParams,
  DocumentFoldersResponse,
  DocumentsQueryParams,
  DocumentsResponse,
  DocumentTag,
  UpdateDocumentPayload,
  UpdateDocumentResponse,
  UpdateFolderInput,
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

export async function updateProjectDocument({
  subdomain,
  projectSlug,
  documentId,
  payload,
}: {
  subdomain: string;
  projectSlug: string;
  documentId: number | string;
  payload: UpdateDocumentPayload;
}): Promise<UpdateDocumentResponse> {
  const { data } = await api.patch(
    `/organizations/${subdomain}/projects/${projectSlug}/documents/${documentId}/`,
    payload,
  );
  return data;
}

export async function deleteProjectDocument({
  subdomain,
  projectSlug,
  documentId,
}: {
  subdomain: string;
  projectSlug: string;
  documentId: number | string;
}): Promise<DeleteDocumentResponse> {
  const { data } = await api.delete(
    `/organizations/${subdomain}/projects/${projectSlug}/documents/${documentId}/`,
  );
  return data;
}

export async function updateDocumentFolder({
  subdomain,
  projectSlug,
  folderId,
  data,
}: {
  subdomain: string;
  projectSlug: string;
  folderId: number;
  data: UpdateFolderInput;
}) {
  const response = await api.patch(
    `/organizations/${subdomain}/projects/${projectSlug}/document-folders/${folderId}/`,
    data,
  );
  return response.data;
}

export async function deleteDocumentFolder({
  subdomain,
  projectSlug,
  folderId,
}: {
  subdomain: string;
  projectSlug: string;
  folderId: number;
}) {
  const response = await api.delete(
    `/organizations/${subdomain}/projects/${projectSlug}/document-folders/${folderId}/`,
  );
  return response.data;
}

export async function fetchDocumentTags(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
): Promise<{ count: number; results: DocumentTag[] }> {
  const { data } = await api.get(
    `/organizations/${subdomain}/projects/${projectSlug}/documents/${documentId}/tags/`,
  );
  return data;
}
