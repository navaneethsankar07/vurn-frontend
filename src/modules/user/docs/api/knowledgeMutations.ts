// src/modules/knowledge/api/knowledgeMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateDocumentFolderPayload,
  CreateDocumentPayload,
  UpdateDocumentPayload,
} from "../types";
import {
  createDocumentFolder,
  createProjectDocument,
  deleteProjectDocument,
  updateProjectDocument,
} from "./docsApi";

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
      window.location.reload();
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
