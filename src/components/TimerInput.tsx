import { useState } from 'react';
import { useSettingsStore } from '../store/modeStore';
import { useSerialStore } from '../store/serialStore';

export const TimerInput = () => {
  const { settings, setSettings } = useSettingsStore();
  const [isRunning, setIsRunning] = useState(false);
  const { writer } = useSerialStore();
  let intervalId: number;

  const handleStart = () => {
    if (!isRunning && writer) {
      setIsRunning(true);
      intervalId = window.setInterval(async () => {
        await writer.write(new TextEncoder().encode(settings.r.command + '\n'));
      }, settings.seconds * 1000);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    clearInterval(intervalId);
  };

  return (
    <div className="timer-controls">
      <input
        type="number"
        value={settings.seconds}
        onChange={(e) => setSettings({ seconds: Number(e.target.value) })}
        min="1"
      />
      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <button onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>
    </div>
  );
};