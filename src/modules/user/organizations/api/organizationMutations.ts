// api/organizationMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganization } from "./organizationApi";
import { organizationKeys } from "./organizationQueries";
import type { CreateOrganizationPayload } from "../types";

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationPayload) => createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}
