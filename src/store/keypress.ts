import { create } from "zustand";
import { persist } from "zustand/middleware";

type KeyCommand = {
  id: string;
  key: string;
  command: string;
  deviceId: string;
};

type Status = {
  keyCommands: KeyCommand[];
  setKeyCommand: (id: string, key: string, command: string, deviceId: string) => void;
  removeKeyCommand: (id: string) => void;
};

export const useKeypressStore = create<Status>()(
  persist(
    (set, get) => ({
      keyCommands: [],
      setKeyCommand: (id, key, command, deviceId) => {
        const { keyCommands } = get()
        if (keyCommands.some(kc => kc.id === id)) {
          set({ keyCommands: keyCommands.map(kc => kc.id === id ? { id, key, command, deviceId } : kc) });
          return;
        }
        set({ keyCommands: [...keyCommands, { id, key, command, deviceId }] });
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