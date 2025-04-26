import { useGeneralStatus } from '../store/general';
import { Button, Select, MenuItem, TextField, FormControl, InputLabel, Typography, Box } from '@mui/material';
import styled from 'styled-components';
import { connectToDevice } from '../web-usb-scpi';

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
`;

export const SettingsPanel = () => {
  const {
    mode,
    setMode,
    lifecycleSpan,
    setLifecycleSpan,
    devices,
    addDevice,
    removeDevice
  } = useGeneralStatus();

  const handleAddDevice = async () => {
    try {
      const newDevice = await connectToDevice();
      if (newDevice) addDevice(newDevice);
    } catch (error) {
      console.error('Device connection failed:', error);
    }
  };

  return (
    <>
      <Section>
        <Typography variant="h6" color='black'>General Settings</Typography>

        <FormControl fullWidth size="small">
          <InputLabel>Operation Mode</InputLabel>
          <Select
            value={mode}
            label="Operation Mode"
            onChange={(e) => setMode(e.target.value as 'keypress' | 'schedule')}
          >
            <MenuItem value="keypress">Keypress Mode</MenuItem>
            <MenuItem value="schedule">Schedule Mode</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Lifecycle Interval (ms)"
          type="number"
          value={lifecycleSpan}
          onChange={(e) => setLifecycleSpan(Number(e.target.value))}
          size="small"
          inputProps={{ min: 100, max: 5000 }}
        />

        <Button
          variant="contained"
          onClick={handleAddDevice}
          sx={{ mb: 2 }}
        >
          Add USB Device
        </Button>

        {devices.map(device => (
          <Box key={device.id} sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <Typography sx={{ flexGrow: 1 }}>
              {device.usb.productName || `Device ${device.id}`}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => removeDevice(device.id)}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Section>
    </>
  );
};