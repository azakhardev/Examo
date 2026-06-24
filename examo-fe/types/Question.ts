export enum QuestionType {
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "TRUE_FALSE",
  "OPEN",
}

export type Question = {
  id: string;
  type: string;
  questionText: string;
  maxPoints: number;
  negativePoints?: number;
  options?: string[];
  correctAnswers?: string[];
  imageUrl?: string;
};
