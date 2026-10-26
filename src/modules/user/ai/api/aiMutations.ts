import { useMutation } from "@tanstack/react-query";
import type {
  AiDetectDuplicatesRequest,
  AiEstimateRequest,
  AiReleaseNotesRequest,
  AiSprintSummaryRequest,
  AiTaskBreakdownRequest,
} from "../types";
import {
  detectDuplicateIssues,
  estimateStoryPoints,
  generateReleaseNotes,
  generateSprintSummary,
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

export function useAiGenerateSprintSummary() {
  return useMutation({
    mutationFn: (data: AiSprintSummaryRequest) => generateSprintSummary(data),
  });
}

export function useAiGenerateReleaseNotes() {
  return useMutation({
    mutationFn: (data: AiReleaseNotesRequest) => generateReleaseNotes(data),
  });
}
