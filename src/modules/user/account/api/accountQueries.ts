import { useQuery } from "@tanstack/react-query";

import { getProfile } from "./accountApi";

export const profileKeys = {
  all: ["profile"] as const,
  detail: () => [...profileKeys.all, "detail"] as const,
};

export function useProfileQuery() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getProfile,
  });
}