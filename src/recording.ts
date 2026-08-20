import type { SCPICommandSentEvent } from './web-usb-scpi';

export class RecordingSession {
  readonly startedAt: number;
  readonly commands: SCPICommandSentEvent[] = [];

  constructor(startedAt: number) {
    this.startedAt = startedAt;
  }

  recordCommand(event: SCPICommandSentEvent) {
    if (event.sentAt >= this.startedAt) this.commands.push(event);
  }
}

const escapeCsvValue = (value: string | number) => {
  const text = String(value);
  if (!/[",\r\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
};

export const recordingCommandsToCsv = (
  commands: ReadonlyArray<SCPICommandSentEvent>,
  startedAt: number,
) => {
  const rows: Array<Array<string | number>> = [
    [
      'elapsed_seconds',
      'command_at',
      'device_id',
      'device_name',
      'scpi_command',
    ],
    ...commands.map((command) => [
      ((command.sentAt - startedAt) / 1000).toFixed(3),
      new Date(command.sentAt).toISOString(),
      command.deviceId,
      command.deviceName,
      command.command,
    ]),
  ];

  return rows
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n');
};

export const createRecordingFileName = (startedAt: number) => {
  const timestamp = new Date(startedAt)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
  return `scpi-recording-${timestamp}.csv`;
};
