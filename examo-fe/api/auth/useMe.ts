import { useQuery } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { AuthResponse } from "@/types/AuthResponse";
import { queryKeys } from "../queryKeys";

export default function useMe(enabled: boolean = true) {
  return useQuery<AuthResponse, ApiError>({
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data;
    },
    queryKey: queryKeys.auth.me,
    enabled,
    retry: false,
  });
}
