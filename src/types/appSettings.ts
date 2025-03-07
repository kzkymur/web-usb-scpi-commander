export interface KeyCommand {
  key: string;
  command: string;
}

export interface AppSettings {
  mode: 'key' | 'timer';
  seconds: number;
  r: KeyCommand;
  g: KeyCommand;
  b: KeyCommand;
}