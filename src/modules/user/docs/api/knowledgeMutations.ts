// src/modules/knowledge/api/knowledgeMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CreateDocumentFolderPayload } from "../types";
import { createDocumentFolder } from "./docsApi";

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
