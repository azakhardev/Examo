import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { AuthResponse } from "@/types/AuthResponse";

type Creadentials = {
  token: string;
};

export default function useOAuth() {
  return useMutation<AuthResponse, ApiError, Creadentials>({
    mutationFn: async (payload) => {
      const response = await api.post<AuthResponse>("/auth/google", payload);
      return response.data;
    },
  });
}
