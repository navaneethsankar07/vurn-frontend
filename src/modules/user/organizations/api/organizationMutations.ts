import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveOrganization,
  confirmDeleteOrganization,
  createOrganization,
  createOrganizationRole,
  requestDeleteOrganization,
  updateOrganizationBranding,
  updateOrganizationPreferences,
  updateOrganizationRole,
  updateOrganizationSettings,
} from "./organizationApi";
import { organizationKeys, preferenceKeys } from "./organizationQueries";
import type {
  CreateOrganizationPayload,
  CreateRoleVariables,
  OrganizationRole,
  OrganizationRoles,
  UpdateBrandingPayload,
  UpdateOrganizationPreferencesPayload,
  UpdateRoleVariables,
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

export const useUpdateOrganizationPreferencesMutation = (slug: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOrganizationPreferencesPayload) =>
      updateOrganizationPreferences(slug, payload),
    onSuccess: (data) => {
      queryClient.setQueryData(preferenceKeys.detail(slug), data);
      queryClient.invalidateQueries({
        queryKey: preferenceKeys.detail(slug),
      });
    },
  });
};

export const useCreateOrganizationRole = () => {
  const queryClient = useQueryClient();

  return useMutation<OrganizationRole, any, CreateRoleVariables>({
    mutationFn: ({ subdomain, payload }) =>
      createOrganizationRole(subdomain, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization-roles", variables.subdomain],
      });
    },
  });
};

export const useUpdateOrganizationRole = () => {
  const queryClient = useQueryClient();

  return useMutation<OrganizationRoles, any, UpdateRoleVariables>({
    mutationFn: ({ subdomain, roleId, payload }) =>
      updateOrganizationRole(subdomain, Number(roleId), payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization-roles", variables.subdomain],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization-role", variables.subdomain, variables.roleId],
      });
    },
  });
};
