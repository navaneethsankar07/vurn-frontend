import type { OrganizationQueryParams, PermissionGroup } from "./types";

export const DEFAULT_ORGANIZATION_ICON = "hexagon";
export const DEFAULT_ORGANIZATION_COLOR = "#F59E0B";

export const APP_BASE_DOMAIN =
  import.meta.env.VITE_APP_BASE_DOMAIN || "lvh.me:5173";

export const ITEMS_PER_PAGE = 5;

export const DEFAULT_ORGANIZATION_QUERY_PARAMS: OrganizationQueryParams = {
  page: 1,
  page_size: ITEMS_PER_PAGE,
  sort_by: "recent",
  order: "desc",
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: "Organization",
    permissions: [
      { key: "organization.view", label: "View Organization" },
      { key: "organization.settings.update", label: "Edit Settings" },
      { key: "organization.billing.manage", label: "Manage Billing" },
    ],
  },
  {
    category: "Projects",
    permissions: [
      { key: "project.view", label: "View Projects" },
      { key: "project.create", label: "Create Projects" },
      { key: "project.update", label: "Edit Projects" },
      { key: "project.delete", label: "Delete Projects" },
    ],
  },
  {
    category: "Members",
    permissions: [
      { key: "member.view", label: "View Members" },
      { key: "member.invite", label: "Invite Members" },
      { key: "member.manage", label: "Manage Members" },
      { key: "member.remove", label: "Remove Members" },
    ],
  },
  {
    category: "Issues",
    permissions: [
      { key: "issue.view", label: "View Issues" },
      { key: "issue.create", label: "Create Issues" },
      { key: "issue.update", label: "Edit Issues" },
      { key: "issue.delete", label: "Delete Issues" },
    ],
  },
  {
    category: "Sprints",
    permissions: [
      { key: "sprint.view", label: "View Sprints" },
      { key: "sprint.create", label: "Create Sprints" },
      { key: "sprint.manage", label: "Manage Sprints" },
    ],
  },
  {
    category: "Workflow",
    permissions: [
      { key: "workflow.view", label: "View Workflow" },
      { key: "workflow.manage", label: "Manage Workflow" },
    ],
  },
  {
    category: "Knowledge Base",
    permissions: [
      { key: "knowledge_base.view", label: "View Docs" },
      { key: "knowledge_base.edit", label: "Edit Docs" },
    ],
  },
];
