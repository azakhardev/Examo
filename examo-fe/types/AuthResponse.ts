export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type AuthUser = {
  userId: number;
  username: string;
  email: string;
};
