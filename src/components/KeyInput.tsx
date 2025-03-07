import { useSettingsStore } from '../store/modeStore'

export const KeyInput = () => {
  const { settings, setSettings } = useSettingsStore();
  
  const updateCommand = (color: 'r' | 'g' | 'b', value: string) => {
    setSettings({
      [color]: {
        ...settings[color],
        command: value
      }
    });
  };

  return (
    <div className="key-input-group">
      {(['r', 'g', 'b'] as const).map((color) => (
        <div key={color}>
          <label>
            {color.toUpperCase()} Key:
            <input
              value={settings[color].key}
              onChange={(e) => 
                setSettings({
                  [color]: {
                    ...settings[color],
                    key: e.target.value
                  }
                })
              }
              maxLength={1}
            />
          </label>
          <label>
            {color.toUpperCase()} Command:
            <input
              value={settings[color].command}
              onChange={(e) => updateCommand(color, e.target.value)}
            />
          </label>
        </div>
      ))}
    </div>
  );
};