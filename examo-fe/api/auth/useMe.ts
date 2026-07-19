import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { AuthResponse } from "@/types/AuthResponse";
import { queryKeys } from "../queryKeys";

type Options = Omit<
  UseQueryOptions<AuthResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export default function useMe(options?: Options) {
  return useQuery<AuthResponse, ApiError>({
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data;
    },
    queryKey: queryKeys.auth.me,
    ...options,
  });
}
