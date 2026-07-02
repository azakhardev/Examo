import { Question } from "@/types/Question";
import { Quiz } from "@/types/Quiz";
import { QuizParticipant } from "@/types/QuizParticipant";
import { Test } from "@/types/Test";
import { User } from "@/types/User";

export const QUIZ_1: Quiz = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Database Fundamentals",
  description: "Preparation for the final exam.",
  author: "Edgar Allan Poe",
  favorite: false,
  link: "https://examo:4asdf564a...",
  visibility: "Private",
  updatedAt: "2026-06-20T10:00:00Z",
  categories: ["SQL", "Database"],
  questions: [
    {
      id: "q1",
      type: "SINGLE_CHOICE",
      questionText: "Which database is purely relational?",
      options: [
        { id: "1", text: "MongoDB", isCorrect: false },
        { id: "2", text: "PostgreSQL", isCorrect: true },
        { id: "3", text: "Redis", isCorrect: false },
      ],
      maxPoints: 1,
      negativePoints: 0.5,
    },
    {
      id: "q2",
      type: "OPEN",
      questionText: "Which SQL command is used to delete a table?",
      options: [{ id: "1", text: "DROP TABLE", isCorrect: true }],
      maxPoints: 2,
      negativePoints: 0,
    },
    {
      id: "q3",
      type: "TRUE_FALSE",
      questionText: "Am I a good programmer?",
      options: [
        { id: "1", text: "True", isCorrect: true },
        { id: "2", text: "False", isCorrect: false },
      ],
      maxPoints: 10,
      negativePoints: 10,
    },
  ],
};

export const QUIZ_2: Quiz = {
  id: "111e8400-e29b-41d4-a716-446655441111",
  title: "Software Architecture Patterns",
  description:
    "Advanced quiz covering microservices, monolithic designs, and fundamental design patterns.",
  author: "Azakhardev",
  updatedAt: "2026-06-20T12:00:00Z",
  favorite: true,
  questions: [
    {
      id: "q1",
      type: "SINGLE_CHOICE",
      questionText: "What does the 'C' in MVC stand for?",
      options: [
        { id: "1", text: "Component", isCorrect: false },
        { id: "2", text: "Controller", isCorrect: true },
        { id: "3", text: "Container", isCorrect: false },
        { id: "4", text: "Context", isCorrect: false },
      ],
      maxPoints: 1,
      negativePoints: 0.5,
    },
    {
      id: "q2",
      type: "MULTIPLE_CHOICE",
      questionText:
        "Which of the following are primary characteristics of a Microservices architecture?",
      options: [
        { id: "1", text: "Highly coupled components", isCorrect: false },
        { id: "2", text: "Independently deployable", isCorrect: true },
        { id: "3", text: "Single shared database", isCorrect: false },
        {
          id: "4",
          text: "Organized around business capabilities",
          isCorrect: true,
        },
      ],
      maxPoints: 4,
      negativePoints: 1,
    },
    {
      id: "q3",
      type: "TRUE_FALSE",
      questionText:
        "Is the 'Singleton' pattern classified as a behavioral design pattern?",
      options: [
        { id: "1", text: "YES", isCorrect: false },
        { id: "2", text: "NO", isCorrect: true },
      ],
      maxPoints: 1,
      negativePoints: 1,
    },
    {
      id: "q4",
      type: "OPEN",
      questionText:
        "What are the three pillars of the CAP theorem? (Write them separated by commas)",
      options: [
        {
          id: "1",
          text: "Consistency, Availability, Partition tolerance",
          isCorrect: true,
        },
      ],
      maxPoints: 3,
      negativePoints: 0,
    },
  ],
};

export const quizz_array: Quiz[] = [QUIZ_1, QUIZ_2];

export const question: Question = {
  id: "q1",
  type: "SINGLE_CHOICE",
  questionText: "Which database is purely relational?",
  options: [
    { id: "1", text: "MongoDB", isCorrect: false },
    { id: "2", text: "PostgreSQL", isCorrect: true },
    { id: "3", text: "Redis", isCorrect: false },
  ],
  maxPoints: 1,
  negativePoints: 0.5,
};

export const upcoming_test: Test = {
  id: 1,
  quiz: {
    id: "a1b2",
    title: "Applied Robotics",
    author: "ČVUT",
    description: "Some description",
    updatedAt: "2026-06-20T12:00:00Z",
    favorite: true,
  },
  access_code: "ROBO2026",
  start_at: "22. 06. 2026 17:20",
  end_at: "22. 06. 2026 18:20",
  time_limit_minutes: 60,
};

export const history_test: Test = {
  id: 2,
  quiz: {
    id: "x9y8",
    title: "Low Level Programming",
    author: "ČVUT",
    description: "Some description",
    updatedAt: "2026-06-20T12:00:00Z",
    favorite: false,
  },
  access_code: "ASM2026",
  start_at: "22. 06. 2026 17:20",
  end_at: "22. 06. 2026 18:20",
  time_limit_minutes: 60,
  total_gained_points: 17,
  submitted_at: "22. 06. 2026 18:05",
};

export const USER: User = {
  id: 1,
  username: "azakhardev",
  name: "Artem",
  surname: "Zakharchenko",
  email: "zakharchenkoarte@xxx.cz",
};

export const INITIAL_SHARES: QuizParticipant[] = [
  {
    id: 1,
    user: USER,
    quiz_id: "q-1",
    access_level: "Read",
    blocked: false,
  },
  {
    id: 2,
    user: { ...USER, username: "Artemos" },
    quiz_id: "q-1",
    access_level: "Blocked",
    blocked: true,
  },
];
