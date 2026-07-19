import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { queryKeys } from "../queryKeys";
import { Quiz } from "@/types/Quiz";

type Options = Omit<UseQueryOptions<Quiz[], ApiError>, "queryKey" | "queryFn">;

type GetQuizzesParams = {
  keyword?: string;
  isFavorite?: boolean;
  isAuthor?: boolean;
  visibility?: string;
};

export default function useGetQuizzes(
  { keyword, isFavorite, isAuthor, visibility }: GetQuizzesParams,
  options?: Options,
) {
  return useQuery<Quiz[], ApiError>({
    queryKey: [
      ...queryKeys.quizzes._,
      { keyword, isFavorite, isAuthor, visibility },
    ],

    queryFn: async () => {
      const { data } = await api.get("/quizzes", {
        params: {
          keyword: keyword,
          isFavorite: isFavorite,
          isAuthor: isAuthor,
          visibility: visibility,
        },
      });

      //TODO: Save fetched quizzes locally (ones that are new or updated) and load them from the local storage
      return data;
    },
    ...options,
  });
}
