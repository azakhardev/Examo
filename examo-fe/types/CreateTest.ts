export type CreateTestPayload = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  timeLimit: number;
  questionsCount: number;
  maxPoints: number;
  allowReview: boolean;
  quizId?: string;
};

export type PrintTestFormSchema = {
  title: string;
  description: string;
  date: string;
  testsCount: number;
  questionsPerTest: number;
  questionsPerPage: number;
  pagination: boolean;
  identificationCode: boolean;
  variants: boolean;
};
