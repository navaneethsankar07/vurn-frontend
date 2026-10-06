// src/modules/knowledge/api/knowledgeMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateDocumentFolderPayload,
  CreateDocumentPayload,
  UpdateDocumentPayload,
  UpdateFolderInput,
} from "../types";
import {
  createDocumentFolder,
  createDocumentTag,
  createProjectDocument,
  deleteDocumentFolder,
  deleteProjectDocument,
  removeDocumentTag,
  updateDocumentFolder,
  updateProjectDocument,
} from "./docsApi";
import type { CreateTagInput } from "../schemas/createTagSchema";

export function useCreateDocumentFolder(
  subdomain: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocumentFolderPayload) =>
      createDocumentFolder({ subdomain, projectSlug, payload }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["document-folders", subdomain, projectSlug],
      });
      toast.success(data?.message || "Folder created successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to create folder.";
      toast.error(message);
    },
  });
}

export function useCreateProjectDocument(
  subdomain: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) =>
      createProjectDocument({ subdomain, projectSlug, payload }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", subdomain, projectSlug],
      });
      toast.success(data?.message || "Document created successfully.");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 403) {
        toast.error("You don't have permission to edit the knowledge base.");
      } else {
        const message =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Failed to create document.";
        toast.error(message);
      }
    },
  });
}

export function useUpdateProjectDocument(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDocumentPayload) =>
      updateProjectDocument({
        subdomain,
        projectSlug,
        documentId: documentId!,
        payload,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["document", subdomain, projectSlug, documentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["documents", subdomain, projectSlug],
      });
      toast.success(data?.message || "Document updated successfully.");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 403) {
        toast.error("You don't have permission to edit the knowledge base.");
      } else if (status === 404) {
        toast.error("Document not found.");
      } else {
        const message =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Failed to update document.";
        toast.error(message);
      }
    },
  });
}

export function useDeleteProjectDocument(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      deleteProjectDocument({
        subdomain,
        projectSlug,
        documentId: documentId!,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["documents", subdomain, projectSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", subdomain, projectSlug],
      });
      toast.success(data?.message || "Document deleted successfully.");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      if (status === 403) {
        toast.error("You don't have permission to edit the knowledge base.");
      } else if (status === 404) {
        toast.error("Document not found.");
      } else {
        const message =
          error?.response?.data?.error ||
          error?.response?.data?.detail ||
          "Failed to delete document.";
        toast.error(message);
      }
    },
  });
}

export function useUpdateDocumentFolder(
  subdomain: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      folderId,
      data,
    }: {
      folderId: number;
      data: UpdateFolderInput;
    }) => updateDocumentFolder({ subdomain, projectSlug, folderId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["document-folders", subdomain, projectSlug],
      });
      toast.success("Folder updated successfully.");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.name?.[0] ||
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to update folder.";
      toast.error(message);
    },
  });
}

export function useDeleteDocumentFolder(
  subdomain: string,
  projectSlug: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: number) =>
      deleteDocumentFolder({ subdomain, projectSlug, folderId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["document-folders", subdomain, projectSlug],
      });
      toast.success(data?.message || "Document folder deleted successfully.");
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const errorMessage = error?.response?.data?.error;
      if (status === 400 && errorMessage) {
        toast.error(errorMessage);
      } else if (status === 404) {
        toast.error("Document folder not found.");
      } else {
        toast.error("Failed to delete folder.");
      }
    },
  });
}

export function useCreateDocumentTag(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagInput) =>
      createDocumentTag({
        subdomain,
        projectSlug,
        documentId: documentId!,
        data,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["document-tags", subdomain, projectSlug, documentId],
      });
      toast.success(data?.message || "Document tag created successfully.");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.name?.[0] ||
        "Failed to create tag.";
      toast.error(errorMessage);
    },
  });
}

export function useRemoveDocumentTag(
  subdomain: string,
  projectSlug: string,
  documentId: number | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId: number) =>
      removeDocumentTag({
        subdomain,
        projectSlug,
        documentId: documentId!,
        tagId,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["document-tags", subdomain, projectSlug, documentId],
      });
      toast.success(data?.message || "Document tag removed successfully.");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        "Failed to remove tag.";
      toast.error(errorMessage);
    },
  });
}
