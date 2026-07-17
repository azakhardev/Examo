import { useQuery } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { queryKeys } from "../queryKeys";
import { Quiz } from "@/types/Quiz";

export default function useGetRecent(ids: string[]) {
  return useQuery<Quiz[], ApiError>({
    queryKey: [...queryKeys.quizzes.recent, ids],
    queryFn: async () => {
      const { data } = await api.get("/quizzes/recent", {
        params: {
          ids: ids.join(","),
        },
      });
      return data;
    },
  });
}
