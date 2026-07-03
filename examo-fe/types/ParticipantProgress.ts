import { User } from "./User";

export type ParticipantProgress = {
  user: User;
  answers: number;
  totalQuestions: number;
};
