import { Button, TextField, Grid, Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useKeypressStore } from '../store/keypress';
import { useKeyboardHandler } from '../hooks/useKeyboardHandler';
import { useGeneralStatus } from '../store/general';
import { useState } from 'react';

const KeypressSettings = () => {
  const { devices } = useGeneralStatus();
  const { keyCommands, setKeyCommand, removeKeyCommand } = useKeypressStore();
  useKeyboardHandler();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const handleAddMapping = () => {
    setKeyCommand(crypto.randomUUID(), '', '', selectedDeviceId);
  };

  const handleRemoveMapping = (id: string) => {
    removeKeyCommand(id)
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Key-Command Mappings
      </Typography>

      <Grid container spacing={2}>
        {keyCommands.map(({ id, key, command }) => (
          <Grid item xs={12} key={id}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Device</InputLabel>
                  <Select
                    value={selectedDeviceId}
                    label="Device"
                    onChange={(e) => {
                      setKeyCommand(id, key, command, e.target.value);
                      setSelectedDeviceId(e.target.value);
                    }}
                  >
                    {devices.map((device) => (
                      <MenuItem key={device.id} value={device.id}>
                        {device.usb.productName || `Device ${device.id}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Key"
                  value={key}
                  onChange={(e) => setKeyCommand(id, e.target.value, command, selectedDeviceId)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="SCPI Command"
                  value={command}
                  onChange={(e) => setKeyCommand(id, key, e.target.value, selectedDeviceId)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemoveMapping(id)}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleAddMapping}
      >
        Add New Mapping
      </Button>
    </div>
  );
};

export default KeypressSettings;