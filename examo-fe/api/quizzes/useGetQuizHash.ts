import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import api, { ApiError } from "../api";

type Options = Omit<UseQueryOptions<string, ApiError>, "queryKey" | "queryFn">;

export default function useGetQuizHash(uuid: string, options?: Options) {
  return useQuery<string, ApiError>({
    queryKey: [...queryKeys.quizzes.hash, uuid],
    queryFn: async () => {
      const response = await api.get(`/quizzes/${uuid}/shareHash`);

      return response.data;
    },
    ...options,
  });
}
