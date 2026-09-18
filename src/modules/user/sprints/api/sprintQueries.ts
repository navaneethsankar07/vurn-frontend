import { useQuery } from "@tanstack/react-query";
import {
  fetchBoardSprints,
  fetchColumnIssues,
  fetchKanbanBoard,
  fetchProjectSprints,
  fetchSprintDetail,
} from "./sprintApi";
import type {
  KanbanColumnIssuesParams,
  ProjectSprintsQueryParams,
} from "../types";

export function useProjectSprints(
  subdomain: string,
  projectSlug: string,
  params?: ProjectSprintsQueryParams,
) {
  return useQuery({
    queryKey: ["project-sprints", subdomain, projectSlug, params],
    queryFn: () => fetchProjectSprints(subdomain, projectSlug, params),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useSprintDetail(
  subdomain: string,
  projectSlug: string,
  sprintId: string | number,
) {
  return useQuery({
    queryKey: ["sprint-detail", subdomain, projectSlug, sprintId],
    queryFn: () => fetchSprintDetail(subdomain, projectSlug, sprintId),
    enabled: Boolean(subdomain && projectSlug && sprintId),
  });
}

export function useKanbanBoard(subdomain: string, projectSlug: string) {
  return useQuery({
    queryKey: ["kanban-board", subdomain, projectSlug],
    queryFn: () => fetchKanbanBoard(subdomain, projectSlug),
    enabled: Boolean(subdomain && projectSlug),
  });
}

export function useColumnIssues(
  subdomain: string,
  projectSlug: string,
  statusId: number | string,
  params?: KanbanColumnIssuesParams,
) {
  return useQuery({
    queryKey: [
      "kanban-column-issues",
      subdomain,
      projectSlug,
      statusId,
      params,
    ],
    queryFn: () => fetchColumnIssues(subdomain, projectSlug, statusId, params),
    enabled: Boolean(subdomain && projectSlug && statusId),
  });
}

export function useBoardSprints(subdomain: string, projectSlug: string) {
  return useQuery({
    queryKey: ["kanban-board-sprints", subdomain, projectSlug],
    queryFn: () => fetchBoardSprints(subdomain, projectSlug),
    enabled: Boolean(subdomain && projectSlug),
  });
}
