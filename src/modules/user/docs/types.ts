export interface DocumentFolder {
  id: number;
  name: string;
  created_by_id: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentFoldersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DocumentFolder[];
}

export interface DocumentFoldersQueryParams {
  search?: string;
  page?: number;
  page_size?: number;
}

export interface CreateDocumentFolderPayload {
  name: string;
}

export interface CreateDocumentFolderResponse {
  id: number;
  message: string;
}

export type DocumentSortOption =
  | "updated_desc"
  | "updated_asc"
  | "created_desc"
  | "created_asc"
  | "title_asc"
  | "title_desc";

export interface DocumentItem {
  id: number;
  folder_id: number;
  folder_name: string;
  title: string;
  created_by_id: number;
  created_by_name: string;
  current_version: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DocumentItem[];
}

export interface DocumentsQueryParams {
  folder_id?: number | string;
  search?: string;
  sort?: DocumentSortOption;
  page?: number;
  page_size?: number;
}

export interface CreateDocumentPayload {
  folder_id: number;
  title: string;
  content: string;
}

export interface CreateDocumentResponse {
  id: number;
  message: string;
}

export interface DocumentDetail {
  id: number;
  folder_id: number;
  folder_name: string;
  title: string;
  content: string;
  created_by_id: number;
  created_by_name: string;
  current_version: string | null;
  created_at: string;
  updated_at: string;
}
