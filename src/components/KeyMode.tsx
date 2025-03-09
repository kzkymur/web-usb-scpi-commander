import { useEffect } from 'react';
import { useSerialStore } from '../store/serialStore';
import { Grid, Paper, TextField, Typography, Button, IconButton } from '@mui/material';
import { useSettingsStore } from '../store/modeStore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export const KeyMode = () => {
  const { settings, updateKeyBinding, addKeyBinding, removeKeyBinding } = useSettingsStore();
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Typography variant="h6" component="h2">
          Key Bindings Configuration
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => addKeyBinding()}
        >
          Add Binding
        </Button>
      </div>
      <Grid container spacing={3}>
        {settings.keyBindings.map((binding) => (
          <Grid item xs={12} sm={6} key={binding.id}>
            <Paper elevation={2} style={{ padding: '1rem' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    Binding {binding.id.toUpperCase()}
                  </Typography>
                  <IconButton
                    onClick={() => removeKeyBinding(binding.id)}
                    color="error"
                    aria-label="delete binding"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
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