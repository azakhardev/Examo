import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import api, { ApiError } from "../api";
import { User } from "@/types/User";

type Options = Omit<UseQueryOptions<User, ApiError>, "queryKey" | "queryFn">;

export default function useGetProfileInfo(options?: Options) {
  return useQuery<User, ApiError>({
    queryKey: [...queryKeys.users.profile],
    queryFn: async () => {
      const response = await api.get("/users/profile");

      return response.data;
    },
    ...options,
  });
}
