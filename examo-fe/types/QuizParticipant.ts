import { User } from "./User";

export type QuizParticipant = {
  id: number;
  user: User;
  quiz_id: string;
  access_level: string;
  blocked: boolean;
  bloecked_at?: string;
};
