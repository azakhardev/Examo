import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";

type JoinQuizPayload = {
  shareHash: string;
};

export default function useJoinQuiz(uuid: string) {
  return useMutation<string, ApiError, JoinQuizPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<string>(
        `/quizzes/${uuid}/join`,
        payload,
        { responseType: "text" },
      );
      return response.data;
    },
  });
}
