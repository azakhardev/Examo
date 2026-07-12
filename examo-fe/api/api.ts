// lib/api.ts
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

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

const BASE_URL = "http://192.168.0.61:8080";

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
    const token = await SecureStore.getItemAsync("examo_jwt_token");
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
