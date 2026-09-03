import { useQuery } from "@tanstack/react-query";
import { getProjectOptions } from "./projectApi";

export const useProjectOptions = () => {
  return useQuery({
    queryKey: ["project-options"],
    queryFn: getProjectOptions,
  });
};
