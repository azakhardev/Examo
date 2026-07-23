import { Question } from "./Question";

export type TestSubmission = {
  test_id: number;
  author_id: number;
  submission_id: string;
  title: string;
  total_points_gained: number;
  answers: TestSubmissionAnswer[];
};

export type TestSubmissionAnswer = {
  id: string;
  question: Question;
  answer: { text: string; correct: boolean | null }[];
  gained_points: number;
};

export type GradeSubmissionForm = {
  points: Record<string, number>;
};
