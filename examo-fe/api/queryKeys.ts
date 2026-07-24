// api/queryKeys.ts
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  tests: {
    _: ["tests"],
    foreign: {
      _: ["tests", "foreign"],
      detail: ["tests", "foreign", "detail"],
    },
    owned: ["tests", "owned"],
  },
  practice: {
    history: ["practice", "history"],
  },
  quizzes: {
    _: ["quizzes"],
    search: ["quizzes", "search"],
    recent: ["quizzes", "recent"],
    detail: ["quizzes", "detail"],
  },
  users: {
    profile: ["users", "profile"],
  },
};
