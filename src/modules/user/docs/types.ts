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
