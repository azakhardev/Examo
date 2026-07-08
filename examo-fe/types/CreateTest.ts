export type TestFormSchema = {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  timeLimit: number;
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
