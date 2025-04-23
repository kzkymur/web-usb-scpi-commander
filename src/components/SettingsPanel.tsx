import { useGeneralStatus } from '../store/general';
import { Button, Select, MenuItem, TextField, FormControl, InputLabel, Typography } from '@mui/material';
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
    device,
    setDevice,
  } = useGeneralStatus();

  const handleConnectDevice = async () => {
    try {
      const newDevice = await connectToDevice();
      setDevice(newDevice);
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

        {device ? (
          <Button
            variant="contained"
            color="error"
            onClick={() => setDevice(null)}
          >
            Disconnect {device.device.productName}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleConnectDevice}
          >
            Connect USB Device
          </Button>
        )}
      </Section>
    </>
  );
};