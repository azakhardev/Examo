import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "@/api/api";
import { CreateTestPayload } from "@/types/CreateTest";
import { Test } from "@/types/Test";

export default function useCreateTest() {
  return useMutation<Test, ApiError, CreateTestPayload>({
    mutationFn: async (payload) => {
      const response = await api.post<Test>(`/tests/create`, payload);
      return response.data;
    },
  });
}
