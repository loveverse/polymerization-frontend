import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createIds, IdsContext } from "./modules/globalIds";

export type Store = IdsContext;

const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createIds(...a),
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        ids: state.ids,
      }),
    }
  )
);

export const useIds = () => useStore((state) => state);
