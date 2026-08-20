import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { Quiz } from "@/types/Quiz";

export default function useCreateQuiz() {
  return useMutation<Quiz, ApiError, Quiz>({
    mutationFn: async (payload) => {
      const response = await api.post<Quiz>(`/quizzes/create`, payload);
      return response.data;
    },
  });
}
