import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppMode = 'key' | 'schedule';

interface AppSettings {
  mode: AppMode;
  seconds: number;
  r: { key: string; command: string };
  g: { key: string; command: string };
  b: { key: string; command: string };
}

interface SettingsStore {
  settings: AppSettings;
  setSettings: (newSettings: Partial<AppSettings>) => void;
  setMode: (mode: AppMode) => void;
}

const initialSettings: AppSettings = {
  mode: 'key',
  seconds: 5,
  r: { key: 'r', command: '' },
  g: { key: 'g', command: '' },
  b: { key: 'b', command: '' },
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
    }),
    {
      name: 'serial-command-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);