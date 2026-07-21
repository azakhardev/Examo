import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { queryKeys } from "../queryKeys";
import { Quiz } from "@/types/Quiz";

type Options = Omit<UseQueryOptions<Quiz[], ApiError>, "queryKey" | "queryFn">;

export default function useGetRecent(ids: string[], options?: Options) {
  return useQuery<Quiz[], ApiError>({
    queryKey: [...queryKeys.quizzes.recent, ids],
    queryFn: async () => {
      const { data } = await api.get("/quizzes/recent", {
        params: {
          uuids: ids.join(","),
        },
      });
      return data;
    },
    ...options,
  });
}
