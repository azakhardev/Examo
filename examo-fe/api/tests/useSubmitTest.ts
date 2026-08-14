import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";

export type SubmittedAnswer = {
  questionId: string;
  answer: {
    optionIds?: string[]; // Used for SINGLE, MULTIPLE, and TRUE_FALSE
    text?: string; // Used strictly for OPEN questions
  };
};

export default function useSubmitTest(id: number) {
  return useMutation<number, ApiError, SubmittedAnswer[]>({
    mutationFn: async (payload) => {
      const response = await api.post<number>(`/tests/${id}/submit`, payload);
      return response.data;
    },
  });
}
