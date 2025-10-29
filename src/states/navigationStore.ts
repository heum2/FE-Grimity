import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface NavigationStore {
  depth: number;
  increaseDepth: () => void;
  decreaseDepth: () => void;
  resetDepth: () => void;
}

export const useNavigationStore = create(
  persist<NavigationStore>(
    (set) => ({
      depth: 0,
      increaseDepth: () => set((state) => ({ depth: state.depth + 1 })),
      decreaseDepth: () => set((state) => ({ depth: Math.max(0, state.depth - 1) })),
      resetDepth: () => set({ depth: 0 }),
    }),
    {
      name: "navigation-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
