import { Quiz } from "./Quiz";

export type Test = {
  id: number;
  quiz?: Quiz;
  title?: string;
  description?: string;
  access_code?: string;
  start_at?: string;
  end_at?: string;
  time_limit_minutes?: number;
  total_gained_points?: number;
  submitted_at?: string;
  totalParticipants?: number;
  totalSubmissions?: number;
};
