import { KeyMode } from './KeyMode'
import { TimerMode } from './TimerMode'
import { useSettingsStore } from '../store/modeStore'

export const ModeContent = () => {
  const { settings } = useSettingsStore();
  
  return (
    <div>
      {settings.mode === 'key' ? (
        <div>
          <KeyMode />
        </div>
      ) : (
        <TimerMode />
      )}
    </div>
  )
}