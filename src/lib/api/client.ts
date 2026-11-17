import axios, { AxiosError } from "axios";
import { ApiError } from "../types";

export const TOKEN_KEY = "lsdo-token";

export const USE_MOCK = import.meta.env['VITE_USE_MOCK'] !== "false";

export const http = axios.create({
  baseURL: import.meta.env['VITE_API_URL'] ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (r) => r,
  (err: AxiosError<{ detail?: unknown }>) => {
    const status = err.response?.status ?? 0;
    const d = err.response?.data?.detail;
    const detail = typeof d === "string" ? d : Array.isArray(d) ? "Invalid input" : err.message;
    return Promise.reject(new ApiError(status, detail));
  },
);
