import { type Question } from "./Question";

export type Quiz = {
  id: string;
  title: string;
  description: string;
  authorId?: number;
  author: string;
  updatedAt: string;
  maxPoints?: number;
  categories?: string[];
  favorite: boolean;
  questions?: Question[];
};
