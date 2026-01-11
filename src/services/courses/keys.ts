export const coursesKeys = {
  all: ["courses"] as const,
  search: (q: string) => [...coursesKeys.all, "search", q] as const,
};
