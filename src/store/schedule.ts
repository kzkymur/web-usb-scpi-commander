import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IndependentSequencer, IndependentFragment } from '@kzkymur/sequencer';
import { useEffect } from 'react';
import { useGeneralStatus } from './general';

type Command = {
  id: string;
  command: string;
  duration: number;
  startTime: number;
  deviceId: string;
}

interface ScheduleState {
  commands: Command[];
  addCommand: (command: Command) => void;
  removeCommand: (id: string) => void;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      commands: [],
      addCommand: (command) => {
        set((state) => ({ commands: [...state.commands, command], }));
      },
      removeCommand: (id) => {
        set((state) => ({ commands: state.commands.filter((cmd) => cmd.id !== id) }));
      },
    }),
    {
      name: 'schedule-storage',
      partialize: (state) => ({ commands: state.commands, })
    }
  )
);

interface ScheduleSequencerState {
  sequencer: IndependentSequencer | null;
  fragments: IndependentFragment[];
  deviceId: string | null;
  setSequencer: (sequencer: IndependentSequencer | null) => void;
  addCommand: (command: Command) => void;
  removeCommand: (id: string) => void;
  setDeviceId: (deviceId: string | null) => void;
}

export const useScheduleSequencerStore = create<ScheduleSequencerState>()((set, get) => ({
  sequencer: null,
  commands: [],
  fragments: [],
  deviceId: null,
  setSequencer: (sequencer) => set({ sequencer }),
  addCommand: (command) => {
    const { sequencer } = get();
    const device = useGeneralStatus.getState().devices.find(d => d.id === command.deviceId);
    if (sequencer === null) {
      throw new Error("Sequencer has not been set.");
    }
    const frag = new IndependentFragment(command.id, command.duration, command.startTime, () => {
      device?.sendSCPICommand(command.command).catch(console.error);
    })
    sequencer.push(frag);
    set((state) => ({ fragments: [...state.fragments, frag] }));
  },
  removeCommand: (id) => {
    const { sequencer, fragments } = get();
    if (sequencer === null) {
      throw new Error("Sequencer has not been set.");
    }
    const frag = fragments.find(f => f.getName() === id);
    if (frag === undefined) {
      throw new Error("Recieved id does NOT exist or has already removed");
    }
    set((state) => ({ fragments: state.fragments.filter(f => f.getName() !== id) }));
    sequencer.remove(frag);
  },
  setDeviceId: (deviceId) => set({ deviceId })
}));

export const useScheduleSequencer = () => {
  const scheduleStore = useScheduleStore();
  const sequenceStore = useScheduleSequencerStore();

  useEffect(() => {
    if (!sequenceStore.sequencer) {
      sequenceStore.setSequencer(new IndependentSequencer(100, 1.0, false));

      if (scheduleStore.commands.length) {
        scheduleStore.commands.forEach(c => {
          sequenceStore.addCommand(c)
        })
      }
    }
  }, [sequenceStore.sequencer, sequenceStore, scheduleStore.commands]);

  return {
    // From scheduleStore
    commands: scheduleStore.commands,

    // From sequenceStore
    sequencer: sequenceStore.sequencer,
    fragments: sequenceStore.fragments,
    deviceId: sequenceStore.deviceId,
    setSequencer: sequenceStore.setSequencer,
    setDeviceId: sequenceStore.setDeviceId,

    // Unified methods
    addCommand: (command: Command) => {
      scheduleStore.addCommand(command);
      sequenceStore.addCommand(command);
    },
    removeCommand: (id: string) => {
      scheduleStore.removeCommand(id);
      sequenceStore.removeCommand(id);
    },
  };
};