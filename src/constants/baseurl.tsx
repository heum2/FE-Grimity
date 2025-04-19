import axios, { InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/states/authStore";
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { access_token } = useAuthStore.getState();

    if (config.headers["exclude-access-token"]) {
      delete config.headers["exclude-access-token"];
      return config;
    }

    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.config.headers["is-delete-account"] === "true") {
      return response;
    }
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.headers["is-delete-account"] === "true") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const response = await axios.get(`${baseUrl}/auth/refresh`, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          useAuthStore.getState().setAccessToken(accessToken);
          useAuthStore.getState().setIsLoggedIn(true);
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          useAuthStore.getState().clearAuth();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
