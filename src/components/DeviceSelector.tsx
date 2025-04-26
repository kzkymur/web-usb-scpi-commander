import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useGeneralStatus } from '../store/general';

type Props = {
  selectedDevice: string;
  onChange: (deviceId: string) => void;
};

const DeviceSelector = ({ selectedDevice, onChange }: Props) => {
  const { devices } = useGeneralStatus();

  return (
    <FormControl fullWidth>
      <InputLabel>Device</InputLabel>
      <Select
        value={selectedDevice}
        label="Device"
        onChange={(e) => onChange(e.target.value)}
      >
        {devices.map((device) => (
          <MenuItem key={device.id} value={device.id}>
            {device.usb.productName || `Device ${device.id}`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DeviceSelector;