import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SerialState {
  port: SerialPort | null;
  writer: WritableStreamDefaultWriter | null;
  baudRate: number;
  isConnected: boolean;
  connect: (baudRate: number) => Promise<void>;
  disconnect: () => Promise<void>;
  setBaudRate: (baudRate: number) => void;
}

export const useSerialStore = create<SerialState>()(
  persist(
    (set) => ({
      port: null,
      writer: null,
      baudRate: 9600,
      isConnected: false,
      connect: async (baudRate) => {
        try {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate });
          const writer = port.writable?.getWriter();
          set({ port, writer, isConnected: true, baudRate });
        } catch (err) {
          console.error('Error connecting to serial:', err);
        }
      },
      disconnect: async () => {
        const { port, writer } = useSerialStore.getState();
        if (port && writer) {
          await writer.close();
          await port.close();
          set({ port: null, writer: null, isConnected: false });
        }
      },
      setBaudRate: (baudRate) => set({ baudRate }),
    }),
    {
      name: 'serial-storage',
      partialize: (state) => ({ baudRate: state.baudRate }),
    }
  )
);