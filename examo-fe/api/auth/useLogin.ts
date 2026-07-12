import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { AuthResponse } from "@/types/AuthResponse";

type Creadentials = {
  email: string;
  password: string;
};

export default function useLogin() {
  return useMutation<AuthResponse, ApiError, Creadentials>({
    mutationFn: async (payload) => {
      const response = await api.post<AuthResponse>("/auth/login", payload);
      return response.data;
    },
  });
}
