import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";

type JoinTestBody = {
  accessCode: string;
};

export default function useJoinTest(id: number) {
  return useMutation<boolean, ApiError, JoinTestBody>({
    mutationFn: async (payload) => {
      const response = await api.post<boolean>(`/tests/${id}/join`, payload);
      return response.data;
    },
  });
}
