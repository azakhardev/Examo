import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import api, { ApiError } from "../api";
import { Test } from "@/types/Test";

type Options = Omit<UseQueryOptions<Test[], ApiError>, "queryKey" | "queryFn">;

export default function useGetForeignTests(type: string, options?: Options) {
  return useQuery<Test[], ApiError>({
    queryKey: [...queryKeys.tests.foreign._, type],
    queryFn: async () => {
      const response = await api.get("/tests/student", {
        params: { type: type },
      });

      return response.data;
    },
    ...options,
  });
}
