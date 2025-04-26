import { Fragment, Sequencer } from "@kzkymur/sequencer";
import { create } from "zustand";
import { SCPIDevice } from "./web-usb-scpi";
import { useGeneralStatus } from "./store/general";

type Commander = {
  scpi: SCPIDevice;
  cmd: string;
}

type State = {
  sequencer: Sequencer;
  frag: Fragment;
  commanders: Commander[];
  addCommander: (scpi: SCPIDevice, cmd: string) => void;
  changePitch: (pitch: number) => void;
};

export const useCmdSenderWorker = create<(State)>((set, get) => {
  const sequencer = new Sequencer(50, 1, true, true);
  const frag = new Fragment("cmd-sender", 50, async () => {
    const commandsByDevice = new Map<string, string[]>();

    // Group commands by device ID
    get().commanders.forEach(({ cmd, scpi }) => {
      if (!commandsByDevice.has(scpi.id)) {
        commandsByDevice.set(scpi.id, []);
      }
      commandsByDevice.get(scpi.id)?.push(cmd);
    });

    // Send batched commands per device
    for (const [deviceId, commands] of commandsByDevice) {
      const device = useGeneralStatus.getState().devices.find(d => d.id === deviceId);
      if (device) {
        await device.sendSCPICommand(commands.join('\n')).catch(console.error);
      }
    }

    set({ commanders: [] });
  });
  return {
    sequencer,
    frag,
    commanders: [],
    addCommander: (scpi, cmd) => set({
      commanders: [
        ...get().commanders.filter(c => c.scpi.id !== scpi.id), // Remove existing commands for this device
        { scpi, cmd } // Add new command
      ]
    }),
    changePitch: (pitch) => {
      sequencer.setPitch(pitch);
      frag.setDuration(pitch);
    },
    start: () => sequencer.play(),
    stop: () => sequencer.stop()
  }
});