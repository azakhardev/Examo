export type QuestionType =
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "OPEN";

export type Question = {
  id: string;
  type: string;
  questionText: string;
  maxPoints: number;
  negativePoints?: number;
  options?: QuestionOption[];
  imageUrl?: string;
};

export type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};
