import { Fragment, Sequencer } from "@kzkymur/sequencer";
import { create } from "zustand";
import { SCPIDevice } from "./web-usb-scpi";
import { useGeneralStatus } from "./store/general";

type Commander = {
  scpi: SCPIDevice;
  cmd: string;
  deviceId: string;
}

type State = {
  sequencer: Sequencer;
  frag: Fragment;
  commanders: Commander[];
  addCommander: (scpi: SCPIDevice, cmd: string, deviceId: string) => void;
  changePitch: (pitch: number) => void;
};

export const useCmdSenderWorker = create<(State)>((set, get) => {
  const sequencer = new Sequencer(50, 1, true, true);
  const frag = new Fragment("cmd-sender", 50, async () => {
    const commandsByDevice = new Map<string, string[]>();

    // Group commands by device ID
    get().commanders.forEach(({ cmd, deviceId }) => {
      if (!commandsByDevice.has(deviceId)) {
        commandsByDevice.set(deviceId, []);
      }
      commandsByDevice.get(deviceId)?.push(cmd);
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
    addCommander: (scpi, cmd, deviceId) => set({
      commanders: [
        ...get().commanders.filter(c => c.deviceId !== deviceId), // Remove existing commands for this device
        { scpi, cmd, deviceId } // Add new command
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