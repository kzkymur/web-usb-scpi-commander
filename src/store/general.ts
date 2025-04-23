import { SCPIDevice } from "web-usb-scpi";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Mode = "keypress" | "schedule";

type Status = {
  sidebarWidth: number;
  mode: Mode;
  lifecycleSpan: number;
  device: SCPIDevice | null;
  setMode: (mode: Mode) => void;
  setLifecycleSpan: (span: number) => void;
  setDevice: (device: SCPIDevice | null) => void;
};

export const useGeneralStatus = create<Status>()(
  persist(
    (set) => ({
      sidebarWidth: 300,
      mode: "keypress",
      lifecycleSpan: 500,
      device: null,
      keyCommandMap: {},
      setMode: (mode) => set({ mode }),
      setLifecycleSpan: (lifecycleSpan) => set({ lifecycleSpan }),
      setDevice: (device) => set({ device }),
    }),
    {
      name: "general-storage",
      partialize: (state) => ({
        sidebarWidth: state.sidebarWidth,
        mode: state.mode,
        lifecycleSpan: state.lifecycleSpan,
      }),
    }
  )
);