import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { queryKeys } from "../queryKeys";
import { Quiz } from "@/types/Quiz";

type Options = Omit<UseQueryOptions<Quiz[], ApiError>, "queryKey" | "queryFn">;

export default function useSearch(keyword: string, options?: Options) {
  return useQuery<Quiz[], ApiError>({
    queryKey: [...queryKeys.quizzes.search, keyword],
    queryFn: async () => {
      const { data } = await api.get("/quizzes/search", {
        params: {
          keyword: keyword,
        },
      });
      return data;
    },
    ...options,
  });
}
