import api from "@/api/axios";
import type { AiEstimateRequest, AiEstimateResponse, AiTaskBreakdownRequest, AiTaskBreakdownResponse } from "../types";

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