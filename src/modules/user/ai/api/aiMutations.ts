import { useMutation } from "@tanstack/react-query";
import type {
  AiDetectDuplicatesRequest,
  AiEstimateRequest,
  AiTaskBreakdownRequest,
} from "../types";
import {
  detectDuplicateIssues,
  estimateStoryPoints,
  generateTaskBreakdown,
} from "./aiApi";

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

export function useAiDetectDuplicates() {
  return useMutation({
    mutationFn: (data: AiDetectDuplicatesRequest) =>
      detectDuplicateIssues(data),
  });
}
