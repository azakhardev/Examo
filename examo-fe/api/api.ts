// lib/api.ts
import axios, { AxiosError } from "axios";
import { storage } from "@/utils";

export interface BackendErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

export class ApiError extends Error {
  status: number;
  errorType: string;
  timestamp: string;

  constructor(backendError: BackendErrorResponse) {
    super(backendError.message);
    this.name = "ApiError";
    this.status = backendError.status;
    this.errorType = backendError.error;
    this.timestamp = backendError.timestamp;
  }
}

//TODO: Replace in env
const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    //Inject JWT Token
    const token = await storage.getItem("examo_jwt_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    //If success - return response
    return response;
  },
  (error: AxiosError<BackendErrorResponse>) => {
    // If error - return structured ErrorResponse (400, 401, 409, 500)
    if (error.response && error.response.data) {
      // Throw our custom error so TanStack query catches it cleanly
      throw new ApiError(error.response.data);
    }

    // Fallback for network errors (server down, no internet)
    throw new Error(error.message || "Network Error");
  },
);

export default api;
