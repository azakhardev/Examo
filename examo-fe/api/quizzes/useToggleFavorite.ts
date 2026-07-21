import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";

export default function useToggleFavorite(uuid: string) {
  return useMutation<boolean, ApiError>({
    mutationFn: async () => {
      const response = await api.put<boolean>(`/quizzes/favorite/${uuid}`);
      return response.data;
    },
  });
}
