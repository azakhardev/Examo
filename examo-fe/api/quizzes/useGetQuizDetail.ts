import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import api, { ApiError } from "../api";
import { Quiz } from "@/types/Quiz";

type Options = Omit<UseQueryOptions<Quiz, ApiError>, "queryKey" | "queryFn">;

export default function useGetQuizDetail(uuid: string, options?: Options) {
  return useQuery<Quiz, ApiError>({
    queryKey: [...queryKeys.quizzes.detail, uuid],
    queryFn: async () => {
      const response = await api.get(`/quizzes/${uuid}`);

      return response.data;
    },
    ...options,
  });
}
