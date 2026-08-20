import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { Quiz } from "@/types/Quiz";

export default function useEditQuiz(quizUuid: string) {
  return useMutation<Quiz, ApiError, Quiz>({
    mutationFn: async (payload) => {
      const response = await api.put<Quiz>(
        `/quizzes/${quizUuid}/edit`,
        payload,
      );
      return response.data;
    },
  });
}
