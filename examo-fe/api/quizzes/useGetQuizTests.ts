import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import api, { ApiError } from "../api";
import { Test } from "@/types/Test";

type Options = Omit<UseQueryOptions<Test[], ApiError>, "queryKey" | "queryFn">;

export default function useGetQuizTests(
  uuid: string,
  type?: string,
  options?: Options,
) {
  return useQuery<Test[], ApiError>({
    queryKey: [...queryKeys.quizzes.tests, uuid, type],
    queryFn: async () => {
      const response = await api.get(`/quizzes/${uuid}/tests?type=${type}`);

      return response.data;
    },
    ...options,
  });
}
