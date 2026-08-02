import axiosInstance from "./axios";

export const setupInterceptors = () => {
  axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
};