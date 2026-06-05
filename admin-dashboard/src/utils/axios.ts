import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim().replace(/^["']|["']$/g, "").replace(/\/+$/, "") ||
  "http://localhost:3000";

export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
});

export const privateAxios = axios.create({
  baseURL: API_BASE_URL,
});

privateAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type LoginPayload = {
  identifier: string;
  password: string;
};

export const AuthService = {
  login: (payload: LoginPayload) => {
    return publicAxios.post("/api/v1/auth/login", payload);
  },
};

export const ReportService = {
  getRevenueSummary: () => {
    return privateAxios.get("/api/v1/reports/revenue/calculate");
  },
  getRevenueItems: () => {
    return privateAxios.get("/api/v1/reports/revenue");
  },
  getRevenueTrend: () => {
    return privateAxios.get("/api/v1/reports/line/revenue-trend", {
      params: { groupBy: "day" },
    });
  },
  getTopRevenueServices: () => {
    return privateAxios.get("/api/v1/reports/bar/top-services", {
      params: { limit: 6 },
    });
  },
  getMedicineStock: () => {
    return privateAxios.get("/api/v1/reports/bar/inventory/stock");
  },
  getLowStockMedicines: () => {
    return privateAxios.get("/api/v1/reports/table/low-stock");
  },
  getCancelledAppointments: () => {
    return privateAxios.get("/api/v1/reports/table/appointment/cancelled");
  },
  getUserRoleDistribution: () => {
    return privateAxios.get("/api/v1/reports/pie/auth/role");
  },
  getPetSpeciesDistribution: () => {
    return privateAxios.get("/api/v1/reports/pie/pet/species");
  },
  getAppointmentStatusDistribution: () => {
    return privateAxios.get("/api/v1/reports/pie/appointment/status");
  },
};
