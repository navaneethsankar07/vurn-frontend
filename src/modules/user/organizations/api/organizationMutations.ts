import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveOrganization,
  confirmDeleteOrganization,
  createOrganization,
  requestDeleteOrganization,
  updateOrganizationBranding,
  updateOrganizationSettings,
} from "./organizationApi";
import { organizationKeys } from "./organizationQueries";
import type {
  CreateOrganizationPayload,
  UpdateBrandingPayload,
  UpdateSettingsPayload,
} from "../types";

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationPayload) => createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

export function useUpdateSettingsMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) =>
      updateOrganizationSettings(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.dashboard(slug),
      });
    },
  });
}

export function useUpdateBrandingMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBrandingPayload) =>
      updateOrganizationBranding(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: organizationKeys.dashboard(slug),
      });
    },
  });
}

export function useArchiveOrgMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => archiveOrganization(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

export function useRequestDeleteOrgMutation(slug: string) {
  return useMutation({
    mutationFn: (name: string) => requestDeleteOrganization(slug, name),
  });
}

export function useConfirmDeleteOrgMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => confirmDeleteOrganization(slug, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}
