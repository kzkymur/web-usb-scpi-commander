import { KeyMode } from './KeyMode'
import { ScheduleMode } from './ScheduleMode';
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
        <ScheduleMode />
      )}
    </div>
  )
}