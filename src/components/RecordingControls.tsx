import DownloadIcon from '@mui/icons-material/Download';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import StopIcon from '@mui/icons-material/Stop';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  createRecordingFileName,
  recordingCommandsToCsv,
  RecordingSession,
} from '../recording';
import { subscribeToSCPICommandSent } from '../web-usb-scpi';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  color: #1f2933;
`;

const StatusDot = styled.span<{ $recording: boolean }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  flex: 0 0 auto;
  background: ${({ $recording }) => ($recording ? '#d32f2f' : '#9e9e9e')};
  box-shadow: ${({ $recording }) => ($recording ? '0 0 0 3px rgba(211, 47, 47, 0.14)' : 'none')};
`;

const RecordingControls = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [commandCount, setCommandCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const isRecordingRef = useRef(false);
  const sessionRef = useRef<RecordingSession | null>(null);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;
    isRecordingRef.current = false;
    setIsRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const now = Date.now();
    sessionRef.current = new RecordingSession(now);
    isRecordingRef.current = true;

    setStartedAt(now);
    setCommandCount(0);
    setIsRecording(true);
  }, []);

  const saveCsv = useCallback(() => {
    const session = sessionRef.current;
    if (session === null || session.commands.length === 0) return;

    const csv = recordingCommandsToCsv(session.commands, session.startedAt);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = createRecordingFileName(session.startedAt);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }, []);

  useEffect(() => subscribeToSCPICommandSent((event) => {
    if (!isRecordingRef.current || sessionRef.current === null) return;
    sessionRef.current.recordCommand(event);
    setCommandCount(sessionRef.current.commands.length);
  }), []);

  useEffect(() => () => {
    isRecordingRef.current = false;
  }, []);

  return (
    <Section aria-label="Command recording">
      <Typography variant="h6">Command Recording</Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <StatusDot $recording={isRecording} aria-hidden="true" />
        <Typography variant="body2" fontWeight={600}>
          {isRecording ? 'Recording' : 'Stopped'}
        </Typography>
      </Stack>

      <Box>
        <Typography variant="caption" display="block" color="text.secondary">
          Records each successful command send
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          {commandCount.toLocaleString()} commands
        </Typography>
      </Box>

      <Button
        variant="contained"
        color={isRecording ? 'error' : 'primary'}
        startIcon={isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
        onClick={isRecording ? stopRecording : startRecording}
        fullWidth
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>

      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={saveCsv}
        disabled={commandCount === 0 || startedAt === null}
        fullWidth
      >
        Save CSV
      </Button>
    </Section>
  );
};

export default RecordingControls;
