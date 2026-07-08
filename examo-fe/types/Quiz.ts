import { type Question } from "./Question";

export type Quiz = {
  id?: string;
  title?: string;
  link?: string;
  description?: string;
  visibility?: string;
  author_id?: number;
  author?: string;
  updated_at?: string;
  max_points?: number;
  categories?: string[];
  favorite?: boolean;
  questions?: Question[];
};
