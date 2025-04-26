import { useEffect, useRef, useState } from 'react';
import { Button, Grid, TextField, Typography, List, ListItem, ListItemText, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { IndependentSequencer } from '@kzkymur/sequencer';
import { useScheduleSequencer } from '../store/schedule';
import styled from 'styled-components';
import { useGeneralStatus } from '../store/general';

const Canvas = styled.canvas`
  width: 100%;
  height: 128px;
`;

const ScheduleSettings = () => {
  const { devices } = useGeneralStatus();
  const { sequencer, commands, setSequencer, addCommand, removeCommand } = useScheduleSequencer();
  const [newCommand, setNewCommand] = useState('');
  const [duration, setDuration] = useState(1000);
  const [startTime, setStartTime] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0]?.id || '');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ctx2d, setCtx2d] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) setCtx2d(canvasRef.current.getContext("2d"))
  }, [])

  useEffect(() => {
    const loop = window.setInterval(() => {
      if (!ctx2d || !sequencer || !canvasRef.current) return;
      const { width, height } = canvasRef.current.getBoundingClientRect();
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      ctx2d.canvas.width = width;
      ctx2d.canvas.height = height;
      sequencer.renderToCanvas(ctx2d, { width, height });
    }, 1000 / 60);
    return () => window.clearInterval(loop);
  }, [ctx2d, sequencer])

  const handleAddCommand = () => {
    if (!newCommand) return;
    if (!sequencer) { setSequencer(new IndependentSequencer(100, 1.0, false)) }

    addCommand({
      id: `${newCommand}_${crypto.randomUUID().slice(0, 8)}`,
      command: newCommand,
      duration,
      startTime,
      deviceId: selectedDeviceId,
    });

    setNewCommand('');
    setDuration(1000);
    setStartTime(0);
  };

  const handleStart = () => sequencer?.play();
  const handleStop = () => sequencer?.stop();

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Scheduled Commands
      </Typography>

      <Canvas ref={canvasRef} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Device</InputLabel>
            <Select
              value={selectedDeviceId}
              label="Device"
              onChange={(e) => setSelectedDeviceId(e.target.value)}
            >
              {devices.map((device) => (
                <MenuItem key={device.id} value={device.id}>
                  {device.usb.productName || `Device ${device.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="SCPI Command"
            value={newCommand}
            onChange={(e) => setNewCommand(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Duration (ms)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Start Time (ms)"
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={handleAddCommand}
            fullWidth
          >
            Add Command
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <List dense>
            {commands.map((cmd) => (
              <ListItem
                key={cmd.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => {
                      removeCommand(cmd.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={cmd.command}
                  secondary={`Device: ${devices.find(d => d.id === cmd.deviceId)?.usb.productName || cmd.deviceId} | Duration: ${cmd.duration}ms | Start: ${cmd.startTime}ms`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={4}>
          <Button
            variant="contained"
            color="success"
            onClick={handleStart}
            fullWidth
            sx={{ mb: 2 }}
          >
            Start Sequence
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleStop}
            fullWidth
          >
            Stop Sequence
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ScheduleSettings;