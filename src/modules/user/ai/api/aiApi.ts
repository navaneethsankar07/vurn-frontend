import api from "@/api/axios";
import type {
  AiDetectDuplicatesRequest,
  AiDetectDuplicatesResponse,
  AiEstimateRequest,
  AiEstimateResponse,
  AiTaskBreakdownRequest,
  AiTaskBreakdownResponse,
} from "../types";

export async function generateTaskBreakdown(
  data: AiTaskBreakdownRequest,
): Promise<AiTaskBreakdownResponse> {
  const response = await api.post("/ai/task-breakdown/", data);
  return response.data;
}

export async function estimateStoryPoints(
  data: AiEstimateRequest,
): Promise<AiEstimateResponse> {
  const response = await api.post("/ai/estimate-story-points/", data);
  return response.data;
}

export async function detectDuplicateIssues(
  data: AiDetectDuplicatesRequest,
): Promise<AiDetectDuplicatesResponse> {
  const response = await api.post("/ai/detect-duplicate-issues/", data);
  return response.data;
}
