import axios from "axios";

const rawApiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  "http://localhost:3000/api/v1";

const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "").endsWith("/api/v1")
  ? rawApiBaseUrl.replace(/\/+$/, "")
  : `${rawApiBaseUrl.replace(/\/+$/, "")}/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Khai báo một biến chạy ngầm để tiêm Store vào mà không cần import trực tiếp ở đầu file
let storeRef: any;

export const injectStore = (_store: any) => {
  storeRef = _store;
};

// Đăng ký Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Nếu storeRef đã được tiêm vào, lấy token ra từ đây
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.login?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
