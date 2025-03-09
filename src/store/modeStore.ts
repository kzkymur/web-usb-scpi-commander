import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'key' | 'schedule';

interface KeyBinding {
  id: string;
  key: string;
  command: string;
}

interface AppSettings {
  mode: AppMode;
  seconds: number;
  keyBindings: KeyBinding[];
}

interface SettingsStore {
  settings: AppSettings;
  setSettings: (newSettings: Partial<AppSettings>) => void;
  setMode: (mode: AppMode) => void;
  updateKeyBinding: (id: string, binding: Partial<KeyBinding>) => void;
  addKeyBinding: () => void;
  removeKeyBinding: (id: string) => void;
}

const initialSettings: AppSettings = {
  mode: 'key',
  seconds: 5,
  keyBindings: [],
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: initialSettings,
      setSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      setMode: (mode) =>
        set((state) => ({
          settings: { ...state.settings, mode }
        })),
      updateKeyBinding: (id, binding) =>
        set((state) => ({
          settings: {
            ...state.settings,
            keyBindings: state.settings.keyBindings.map(b =>
              b.id === id ? {...b, ...binding} : b
            )
          }
        })),
      addKeyBinding: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            keyBindings: [
              ...state.settings.keyBindings,
              { id: Date.now().toString(), key: '', command: '' }
            ]
          }
        })),
      removeKeyBinding: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            keyBindings: state.settings.keyBindings.filter(b => b.id !== id)
          }
        })),
    }),
    {
      name: 'serial-command-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);