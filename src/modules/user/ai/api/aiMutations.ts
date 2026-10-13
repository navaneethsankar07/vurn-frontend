import { useMutation } from "@tanstack/react-query";
import type { AiTaskBreakdownRequest } from "../types";
import { generateTaskBreakdown } from "./aiApi";

export function useAiTaskBreakdown() {
  return useMutation({
    mutationFn: (data: AiTaskBreakdownRequest) => generateTaskBreakdown(data),
  });
}
