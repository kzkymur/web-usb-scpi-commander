import { create } from "zustand";
import { persist } from "zustand/middleware";

type KeyCommand = {
  id: string;
  key: string;
  command: string;
};

type Status = {
  keyCommands: KeyCommand[];
  setKeyCommand: (id: string, key: string, command: string) => void;
  removeKeyCommand: (id: string) => void;
};

export const useKeypressStore = create<Status>()(
  persist(
    (set, get) => ({
      keyCommands: [],
      setKeyCommand: (id, key, command) => {
        const { keyCommands } = get()
        if (keyCommands.some(kc => kc.id === id)) {
          set({ keyCommands: keyCommands.map(kc => kc.id === id ? { id, key, command } : kc) });
          return;
        }
        set({ keyCommands: [...keyCommands, { id, key, command }] });
      },
      removeKeyCommand: (id) => {
        set((state) => ({
          keyCommands: state.keyCommands.filter(kc => kc.id !== id)
        }));
      },
    }),
    {
      name: "keypress-storage",
      partialize: (state) => ({
        keyCommands: state.keyCommands,
      }),
    }
  )
);