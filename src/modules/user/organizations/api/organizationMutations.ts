import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveOrganization,
  confirmDeleteOrganization,
  createOrganization,
  createOrganizationRole,
  createRazorpayOrder,
  invitationApi,
  requestDeleteOrganization,
  updateOrganizationBranding,
  updateOrganizationPreferences,
  updateOrganizationRole,
  updateOrganizationSettings,
  verifyCreditPurchase,
} from "./organizationApi";
import {
  INVITATION_KEYS,
  organizationKeys,
  preferenceKeys,
} from "./organizationQueries";
import type {
  CreateInvitationRequest,
  CreateOrganizationPayload,
  CreateRazorpayOrderRequest,
  CreateRoleVariables,
  OrganizationRole,
  OrganizationRoles,
  UpdateBrandingPayload,
  UpdateOrganizationPreferencesPayload,
  UpdateRoleVariables,
  UpdateSettingsPayload,
  VerifyCreditPurchaseRequest,
} from "../types";
import { toast } from "sonner";

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

export function useCreateInvitationMutation(slug: string) {
  return useMutation({
    mutationFn: (data: CreateInvitationRequest) =>
      invitationApi.createInvitation(slug, data),
  });
}

export function useAcceptInvitationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => invitationApi.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITATION_KEYS.received });
    },
  });
}

export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: (data: CreateRazorpayOrderRequest) => createRazorpayOrder(data),
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Unable to create the payment order.";
      toast.error(msg);
    },
  });
}

export function useVerifyCreditPurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyCreditPurchaseRequest) =>
      verifyCreditPurchase(data),
    onSuccess: (res) => {
      toast.success(res?.message || "AI credits purchased successfully.");
      queryClient.invalidateQueries({ queryKey: ["ai-usage-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["ai-usage-history"] });
      queryClient.invalidateQueries({
        queryKey: ["ai-credit-purchase-history"],
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        "Unable to verify the payment.";
      toast.error(msg);
    },
  });
}
