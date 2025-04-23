import { Fragment, Sequencer } from "@kzkymur/sequencer";
import { create } from "zustand";
import { SCPIDevice } from "./web-usb-scpi";

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
    for (const { scpi, cmd } of get().commanders) {
      await scpi.sendSCPICommand(cmd);
    }
    set({ commanders: [] })
  });
  return {
    sequencer,
    frag,
    commanders: [],
    addCommander: (scpi, cmd) => set({ commanders: [...get().commanders, { scpi, cmd }] }),
    changePitch: (pitch) => {
      sequencer.setPitch(pitch);
      frag.setDuration(pitch);
    }
  }
})