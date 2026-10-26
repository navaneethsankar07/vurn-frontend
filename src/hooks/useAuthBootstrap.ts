import { useEffect, useRef } from "react";

import { useAppDispatch } from "@/app/hooks";
import {
  finishAuthInitialization,
  setCredentials,
} from "@/modules/public/auth/authSlice";

import {
  refreshToken,
  getCurrentUser,
} from "@/modules/public/auth/api/authApi";

export function useAuthBootstrap() {
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    let mounted = true;

    async function initializeAuth() {
      try {
        const refreshResponse = await refreshToken();

        if (!mounted) return;

        const userResponse = await getCurrentUser(refreshResponse.access);

        if (!mounted) return;

        dispatch(
          setCredentials({
            user: userResponse,
            accessToken: refreshResponse.access,
          }),
        );
      } catch {
        if (!mounted) return;
      } finally {
        if (mounted) {
          dispatch(finishAuthInitialization());
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch]);
}
