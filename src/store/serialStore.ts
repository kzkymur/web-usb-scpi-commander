import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SerialState {
  port: SerialPort | null;
  baudRate: number;
  isConnected: boolean;
  commandQueue: Set<string>;
  processCommands: () => Promise<void>;
  connect: (baudRate: number) => Promise<void>;
  disconnect: () => Promise<void>;
  setBaudRate: (baudRate: number) => void;
}

export const useSerialStore = create<SerialState>()(
  persist(
    (set, get) => ({
      port: null,
      baudRate: 9600,
      isConnected: false,
      commandQueue: new Set<string>(),
      processCommands: async () => {
        const { port, commandQueue } = get();
        if (port && commandQueue.size > 0) {
          const commands = Array.from(commandQueue).join('\n');
          const writer = port.writable?.getWriter()!;
          await writer.write(new TextEncoder().encode(commands + '\n')).catch(console.error);
          console.log(commands)
          writer.releaseLock();
        }
      },
      connect: async (baudRate) => {
        try {
          const port = await navigator.serial.requestPort();
          await port.open({ baudRate });
          set({ port, isConnected: true, baudRate });
        } catch (err) {
          console.error('Error connecting to serial:', err);
        }
      },
      disconnect: async () => {
        const { port } = useSerialStore.getState();
        if (port) {
          await port.writable?.getWriter()?.close();
          await port.close();
          set({ port: null, isConnected: false });
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