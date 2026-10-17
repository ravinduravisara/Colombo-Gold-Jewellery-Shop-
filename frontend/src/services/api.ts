import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to handle session token from memory or headers if set
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("cgc_token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Guest session ID
    let guestSession = localStorage.getItem("cgc_guest_session");
    if (!guestSession) {
      guestSession = `gst_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("cgc_guest_session", guestSession);
    }
    config.headers["x-guest-session-id"] = guestSession;
  }
  return config;
});

// Response interceptor to catch 401s and attempt silent refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data.data?.accessToken;
        if (newToken && typeof window !== "undefined") {
          localStorage.setItem("cgc_token", newToken);
        }
        processQueue(null, newToken);
        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;
        if (typeof window !== "undefined") {
          localStorage.removeItem("cgc_token");
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

