import { type Question } from "./Question";

export type Quizz = {
  id: string;
  title: string;
  description: string;
  authorId?: number;
  author: string;
  updatedAt: string;
  categories?: string[];
  favorite: boolean;
  questions?: Question[];
};
