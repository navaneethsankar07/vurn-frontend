import { useQuery } from "@tanstack/react-query";

import { getLoginMethod, getProfile } from "./accountApi";

export const accountKeys = {
  profile: ["profile"] as const,
  profileDetail: () => [...accountKeys.profile, "detail"] as const,
  loginMethod: ["login-method"] as const,
};

export function useProfileQuery() {
  return useQuery({
    queryKey: accountKeys.profileDetail(),
    queryFn: getProfile,
  });
}

export function useLoginMethodQuery() {
  return useQuery({
    queryKey: accountKeys.loginMethod,
    queryFn: getLoginMethod,
  });
}
