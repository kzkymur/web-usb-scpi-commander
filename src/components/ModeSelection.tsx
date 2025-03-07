import { useSettingsStore } from '../store/modeStore';

export const ModeSelection = () => {
  const { settings, setMode } = useSettingsStore();
  
  return (
    <select 
      value={settings.mode}
      onChange={(e) => setMode(e.target.value as 'key' | 'schedule')}
    >
      <option value="key">Key Mode</option>
      <option value="schedule">Schedule Mode</option>
    </select>
  );
};