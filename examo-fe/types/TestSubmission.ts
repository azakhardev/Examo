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
  id: string; // The Mongo document ID of this specific answer
  question: Question;
  answer: { text: string; correct: boolean | null }[];
  gained_points: number; // Points currently awarded
};

export type GradeSubmissionForm = {
  points: Record<string, number>; // Maps answer.id -> gained_points
};
