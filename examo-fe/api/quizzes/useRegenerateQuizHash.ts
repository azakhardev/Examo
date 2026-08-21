import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";

export default function useRegenerateQuizHash(uuid: string) {
  return useMutation<string, ApiError>({
    mutationFn: async (payload) => {
      const response = await api.put<string>(`/quizzes/${uuid}/regenerateHash`);
      return response.data;
    },
  });
}
