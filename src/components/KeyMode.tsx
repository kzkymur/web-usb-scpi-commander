import { useEffect } from 'react';
import { useSerialStore } from '../store/serialStore';
import { Grid, Paper, TextField, Typography } from '@mui/material';
import { useSettingsStore } from '../store/modeStore'

export const KeyMode = () => {
  const { settings, updateKeyBinding } = useSettingsStore();
  const { commandQueue } = useSerialStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      settings.keyBindings.forEach(binding => {
        if (binding.key.toLowerCase() === key && binding.command) {
          commandQueue.add(binding.command);
        }
      });
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      settings.keyBindings.forEach(binding => {
        if (binding.key.toLowerCase() === key && binding.command) {
          commandQueue.delete(binding.command);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [settings, commandQueue]);

  useEffect(() => {
    const interval = setInterval(() => {
      useSerialStore.getState().processCommands();
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  const handleInputChange = (id: string, field: 'key' | 'command', value: string) => {
    updateKeyBinding(id, { [field]: value });
  };

  return (
    <div style={{ padding: '1rem' }}>
      <Grid container spacing={3}>
        {settings.keyBindings.map((binding) => (
          <Grid item xs={12} sm={6} key={binding.id}>
            <Paper elevation={2} style={{ padding: '1rem' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Binding {binding.id.toUpperCase()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Key"
                    value={binding.key}
                    onChange={(e) => handleInputChange(binding.id, 'key', e.target.value)}
                    inputProps={{ maxLength: 1 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Command"
                    value={binding.command}
                    onChange={(e) => handleInputChange(binding.id, 'command', e.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};