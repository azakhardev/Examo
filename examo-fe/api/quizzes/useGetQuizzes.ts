import { useQuery } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { queryKeys } from "../queryKeys";
import { Quiz } from "@/types/Quiz";

type GetQuizzesParams = {
  keyword?: string;
  isFavorite?: boolean;
  isAuthor?: boolean;
  accessLevel?: string;
};

export default function useGetQuizzes({
  keyword,
  isFavorite,
  isAuthor,
  accessLevel,
}: GetQuizzesParams) {
  return useQuery<Quiz[], ApiError>({
    queryKey: [
      ...queryKeys.quizzes._,
      { keyword, isFavorite, isAuthor, accessLevel },
    ],

    queryFn: async () => {
      const { data } = await api.get("/quizzes", {
        params: {
          keyword: keyword,
          isFavorite: isFavorite,
          isAuthor: isAuthor,
          accessLevel: accessLevel,
        },
      });

      //TODO: Save fetched quizzes locally (ones that are new or updated) and load them from the local storage
      return data;
    },
  });
}
