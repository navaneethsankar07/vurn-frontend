import api from "@/api/axios";
import type { AiTaskBreakdownRequest, AiTaskBreakdownResponse } from "../types";

export async function generateTaskBreakdown(
  data: AiTaskBreakdownRequest,
): Promise<AiTaskBreakdownResponse> {
  const response = await api.post("/ai/task-breakdown/", data);
  return response.data;
}
