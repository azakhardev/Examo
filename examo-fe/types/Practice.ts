export type PracticeMode = "PRACTICE" | "RACE" | "FLASHCARDS";

export type PracticeHistory = {
  id: string | number; // String if local UUID before sync, number if from DB
  user_id: number;
  quiz_id: string;
  mode: PracticeMode;
  started_at: string;
  completed_at?: string | null;
  duration_minutes?: number;
  total_questions: number;
  total_answers?: number;
  correct_answers?: number;
};

export type PracticeSetup = {
  mode: PracticeMode;
  showCorrectAnswers: boolean;
  questionTimeLimit: number;
  questionsType:
    | "ALL"
    | "SINGLE_CHOICE"
    | "MULTIPLE_CHOICE"
    | "OPEN"
    | "TRUE_FALSE";
  questionsRangeStart: number;
  questionsRangeEnd: number;
  shuffle: boolean;
};
