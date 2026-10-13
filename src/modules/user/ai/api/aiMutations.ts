import { useMutation } from "@tanstack/react-query";
import type { AiEstimateRequest, AiTaskBreakdownRequest } from "../types";
import { estimateStoryPoints, generateTaskBreakdown } from "./aiApi";

export function useAiTaskBreakdown() {
  return useMutation({
    mutationFn: (data: AiTaskBreakdownRequest) => generateTaskBreakdown(data),
  });
}

export function useAiEstimateStoryPoints() {
  return useMutation({
    mutationFn: (data: AiEstimateRequest) => estimateStoryPoints(data),
  });
}
