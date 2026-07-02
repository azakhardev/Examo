import { type Question } from "./Question";

export type Quiz = {
  id?: string;
  title?: string;
  link?: string;
  description?: string;
  visibility?: string;
  authorId?: number;
  author?: string;
  updatedAt?: string;
  maxPoints?: number;
  categories?: string[];
  favorite?: boolean;
  questions?: Question[];
};
