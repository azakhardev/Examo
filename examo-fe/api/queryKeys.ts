// api/queryKeys.ts
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  tests: {
    all: ["tests"] as const,
    detail: (id: number | string) => ["tests", "detail", id] as const,
    history: (userId: number) => ["tests", "history", userId] as const,
  },
  practice: {
    history: ["practice", "history"] as const,
  },
};
