import { useEffect } from "react";

import { useAppDispatch } from "@/app/hooks";
import {
  finishAuthInitialization,
  setAccessToken,
  setCredentials,
} from "@/modules/public/auth/authSlice";

import {
  refreshToken,
  getCurrentUser,
} from "@/modules/public/auth/api/authApi";

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      const hasSession = localStorage.getItem("hasSession");
      if (!hasSession) {
        dispatch(finishAuthInitialization());
        return;
      }
      try {
        const refreshResponse = await refreshToken();

        if (!mounted) return;

        dispatch(setAccessToken(refreshResponse.access));

        const userResponse = await getCurrentUser();

        if (!mounted) return;

        dispatch(
          setCredentials({
            user: userResponse,
            accessToken: refreshResponse.access,
          }),
        );
      } catch {
        if (!mounted) return;
        localStorage.removeItem("hasSession");

        dispatch(finishAuthInitialization());
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch]);
}
