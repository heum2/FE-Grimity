import axios, { InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const refreshAxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let refreshTokenPromise: Promise<string> | null = null;

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");

    if (config.headers["exclude-access-token"]) {
      delete config.headers["exclude-access-token"];
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log(error.response?.status, "for URL:", error.config?.url);

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          console.log("🔄 Starting new token refresh");
          refreshTokenPromise = (async (): Promise<string> => {
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
              console.error("❌ No refresh token found in localStorage");
              throw new Error("No refresh token found");
            }

            console.log("🔄 Sending refresh token request");
            const response = await refreshAxiosInstance.get("/auth/refresh", {
              headers: { Authorization: `Bearer ${refreshToken}` },
            });

            console.log("✅ Token refresh successful, new tokens received");
            localStorage.setItem("access_token", response.data.accessToken);
            localStorage.setItem("refresh_token", response.data.refreshToken);

            return response.data.accessToken;
          })();
        } else {
          console.log("⏳ Using existing refresh token promise");
        }

        const newAccessToken = await refreshTokenPromise;

        refreshTokenPromise = null;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        refreshTokenPromise = null;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
