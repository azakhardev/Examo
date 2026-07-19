import { useMutation } from "@tanstack/react-query";
import api, { ApiError } from "../api";
import { User } from "@/types/User";

type UpdateProfileBody = {
  name?: string;
  surname?: string;
  email?: string;
  username?: string;
};

export default function useUpdateProfileInfo() {
  return useMutation<User, ApiError, UpdateProfileBody>({
    mutationFn: async (payload) => {
      const response = await api.put<User>("/users/profile/update", payload);
      return response.data;
    },
  });
}
