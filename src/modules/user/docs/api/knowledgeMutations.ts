// src/modules/knowledge/api/knowledgeMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateDocumentFolderPayload,
  CreateDocumentPayload,
} from "../types";
import { createDocumentFolder, createProjectDocument } from "./docsApi";

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
