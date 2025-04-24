import { useEffect, useCallback } from 'react';
import type { SCPIDevice } from '../web-usb-scpi';
import { useKeypressStore } from '../store/keypress';
import { useGeneralStatus } from '../store/general';
import { useCmdSenderWorker } from '../command-sender-worker';

export const useKeyboardHandler = (device: SCPIDevice | null) => {
  const { mode } = useGeneralStatus();
  const { keyCommands } = useKeypressStore();
  const { addCommander } = useCmdSenderWorker();

  const handleKeyEvent = useCallback(
    async (e: KeyboardEvent, isKeyDown: boolean) => {
      console.log(e);
      if (mode !== 'keypress' || !device) return;
      const targetKeyCommands = keyCommands.filter(kc => kc.key === e.key);
      if (!targetKeyCommands) return;

      try {
        if (!isKeyDown) return;
        targetKeyCommands.forEach(tkc => {
          addCommander(device, tkc.command);
        })
      } catch (err) {
        console.error('Command send failed:', err);
      }
    },
    [mode, device, keyCommands, addCommander]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyEvent(e, true);
    const handleKeyUp = (e: KeyboardEvent) => handleKeyEvent(e, false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyEvent]);
};
