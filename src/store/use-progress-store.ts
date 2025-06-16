import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { nanoid } from "nanoid";

interface ProgressStore {
  // User identifiers
  userId: string | null;
  accountType: "user" | "guest";

  // Navigation state
  currentLesson: string;
  currentLevel: string;

  // Hierarchical progress: lesson → levels → stars (0–3)
  progress: Record<string, Record<string, number>>;

  // Actions
  setUserId: (id: string | null) => void;
  setCurrentLesson: (lesson: string) => void;
  setCurrentLevel: (level: string) => void;
  setStars: (lesson: string, level: string, stars: number) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set) => ({
      // **initial state**—we’ll override `userId` on rehydrate if absent
      userId: "",
      accountType: "guest",
      currentLesson: "",
      currentLevel: "",
      progress: {},

      // **actions**
      setUserId: (id) =>
        set({
          userId: id,
          accountType: id ? "user" : "guest",
        }),

      setCurrentLesson: (lesson) => set({ currentLesson: lesson }),

      setCurrentLevel: (level) => set({ currentLevel: level }),

      setStars: (lesson, level, stars) =>
        set((state) => {
          const lessonProgress = state.progress[lesson] ?? {};
          return {
            progress: {
              ...state.progress,
              [lesson]: {
                ...lessonProgress,
                [level]: Math.max(0, Math.min(3, stars)),
              },
            },
          };
        }),

      resetProgress: () =>
        set({
          currentLesson: "",
          currentLevel: "",
          progress: {},
        }),
    }),

    {
      name: "progress-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Rehydrate failed:", error);
          return;
        }

        // Only generate & persist a new ID if none was loaded
        if (state && !state.userId) {
          state.setUserId(nanoid());
        }
      },
    },
  ),
);
