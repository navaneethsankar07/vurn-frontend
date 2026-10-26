import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import api from "./axios";
import { store } from "@/app/store";
import { setAccessToken, logout } from "@/modules/public/auth/authSlice";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let isRefreshing = false;

let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeToRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function notifyRefreshSubscribers(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function clearRefreshSubscribers() {
  refreshSubscribers = [];
}

export function setupInterceptors() {
  api.interceptors.request.use(
    (config) => {
      const accessToken = store.getState().auth.accessToken;

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      if (
        originalRequest.url?.includes("/auth/refresh/") ||
        originalRequest.url?.includes("/auth/login/") 
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status !== 401) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeToRefresh((newAccessToken) => {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            api(originalRequest)
              .then(resolve)
              .catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh/`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!refreshResponse.ok) {
          throw new Error("Refresh token expired or invalid.");
        }

        const data = await refreshResponse.json();

        const newAccessToken = data.access;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh.");
        }

        store.dispatch(setAccessToken(newAccessToken));

        notifyRefreshSubscribers(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        clearRefreshSubscribers();

        store.dispatch(logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}