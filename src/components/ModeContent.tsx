import { KeyInput } from './KeyInput'
import { TimerInput } from './TimerInput'
import { useSettingsStore } from '../store/modeStore'

export const ModeContent = () => {
  const { settings } = useSettingsStore();
  
  return (
    <div>
      {settings.mode === 'key' ? (
        <div>
          <KeyInput />
        </div>
      ) : (
        <TimerInput />
      )}
    </div>
  )
}