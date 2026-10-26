import { useOrganizationAccess } from "@/modules/user/organizations/api/organizationQueries";
import { getSubdomain } from "@/utils/subdomain";

export const useOrganizationPermission = (permission: string) => {
  const slug = getSubdomain();

  const { data: access } = useOrganizationAccess(slug ?? "");

  if (!access) {
    return false;
  }

  if (access.has_full_access) {
    return true;
  }

  return access.permissions.includes(permission);
};
