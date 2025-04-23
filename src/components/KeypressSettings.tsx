import { Button, TextField, Grid, Typography } from '@mui/material';
import { useKeypressStore } from '../store/keypress';
import { useKeyboardHandler } from '../hooks/useKeyboardHandler';
import { useGeneralStatus } from '../store/general';

const KeypressSettings = () => {
  const { device } = useGeneralStatus();
  const { keyCommands, setKeyCommand, removeKeyCommand } = useKeypressStore();
  useKeyboardHandler(device);

  const handleAddMapping = () => {
    setKeyCommand(crypto.randomUUID(), '', '');
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
                <TextField
                  label="Key"
                  value={key}
                  onChange={(e) => setKeyCommand(id, e.target.value, command)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  label="SCPI Command"
                  value={command}
                  onChange={(e) => setKeyCommand(id, key, e.target.value)}
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