import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "../queryKeys";
import api, { ApiError } from "../api";
import { TestSession } from "@/types/Test";

type Options = Omit<
  UseQueryOptions<ParticipateResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export type ParticipateResponse = {
  isParticipating: boolean;
  test: TestSession;
};

export default function useGetTestSession(id: number, options?: Options) {
  return useQuery<ParticipateResponse, ApiError>({
    queryKey: [...queryKeys.tests.session, id],
    queryFn: async () => {
      const response = await api.get(`/tests/${id}/session`);

      return response.data;
    },
    ...options,
  });
}
