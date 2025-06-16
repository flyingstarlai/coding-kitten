import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { levelMapper } from "@/game/constans.ts";

export interface LevelProgress {
  id: string;
  locked: boolean;
  stars: number;
}

export interface LessonProgress {
  name: string;
  levels: LevelProgress[];
}

interface ProgressStore {
  userId: string;
  accountType: "user" | "guest";

  progress: Record<string, LessonProgress>;
  unlockLevel: (lesson: string, levelId: string) => void;

  setUserId: (id: string) => void;
  setStars: (lesson: string, levelId: string, stars: number) => void;
  resetProgress: () => void;
}

// helper to create a blank LessonProgress
const makeLessonProgress = (lesson: string): LessonProgress => ({
  name: lesson,
  levels: levelMapper.map((lvl, idx) => ({
    id: lvl.id,
    stars: 0,
    locked: idx !== 0, // only first level unlocked
  })),
});

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      // **initial state**—we’ll override `userId` on rehydrate if absent
      userId: "",
      accountType: "guest",
      progress: {
        sequence: makeLessonProgress("sequence"),
      },

      // **actions**
      setUserId: (id) =>
        set({
          userId: id,
          accountType: id ? "user" : "guest",
        }),

      unlockLevel: (lesson, levelId) =>
        set((state) => {
          const lessonProg = state.progress[lesson];
          if (!lessonProg) return {};
          return {
            progress: {
              ...state.progress,
              [lesson]: {
                ...lessonProg,
                levels: lessonProg.levels.map((l) =>
                  l.id === levelId ? { ...l, locked: false } : l,
                ),
              },
            },
          };
        }),

      setStars: (lesson, levelId, stars) =>
        set((state) => {
          const lessonProg = state.progress[lesson]!;
          return {
            progress: {
              ...state.progress,
              [lesson]: {
                ...lessonProg,
                levels: lessonProg.levels.map((lvl) =>
                  lvl.id === levelId
                    ? { ...lvl, stars: Math.max(0, Math.min(3, stars)) }
                    : lvl,
                ),
              },
            },
          };
        }),
      resetProgress: () =>
        set({
          progress: {},
        }),
    }),

    {
      name: "progress-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
