import { Quiz } from "./Quiz";

export type Test = {
  id: number;
  authorId?: number;
  authorName?: string;
  quiz?: Quiz;
  title?: string;
  description?: string;
  accessCode?: string;
  startAt?: string;
  endAt?: string;
  timeLimitMinutes?: number;
  totalGainedPoints?: number;
  submitted_at?: string;
  totalParticipants?: number;
  maxPoints?: number;
  totalSubmissions?: number;
};
