import { create } from "zustand";
import { persist } from "zustand/middleware";
import { isSameScpiDevice, SCPIDevice } from "../web-usb-scpi";

type Mode = "keypress" | "schedule";

type Status = {
  sidebarWidth: number;
  mode: Mode;
  lifecycleSpan: number;
  devices: SCPIDevice[];
  setMode: (mode: Mode) => void;
  setLifecycleSpan: (span: number) => void;
  addDevice: (device: SCPIDevice) => void;
  removeDevice: (deviceId: string) => void;
};

export const useGeneralStatus = create<Status>()(
  persist(
    (set) => ({
      sidebarWidth: 300,
      mode: "keypress",
      lifecycleSpan: 500,
      devices: [],
      setMode: (mode) => set({ mode }),
      setLifecycleSpan: (lifecycleSpan) => set({ lifecycleSpan }),
      addDevice: (device) => set((state) => ({
        devices: [...state.devices.filter(d => !isSameScpiDevice(d, device)), device]
      })),
      removeDevice: (deviceId) => set((state) => ({
        devices: state.devices.filter(d => d.id !== deviceId)
      })),
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