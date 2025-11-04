// Mock Wails Go bindings for development
import { main } from '../models';

export function SelectFile(_title: string): Promise<string> {
  return Promise.resolve('');
}

export function SelectDirectory(_title: string): Promise<string> {
  return Promise.resolve('');
}

export function FindInPath(_executableName: string): Promise<string> {
  return Promise.reject(new Error('Not found in PATH'));
}

export function StartTranscoding(_config: main.TranscodeConfig): Promise<void> {
  return Promise.resolve();
}

export function StopTranscoding(): Promise<void> {
  return Promise.resolve();
}

export function IsTranscoding(): Promise<boolean> {
  return Promise.resolve(false);
}

export function SaveConfig(_data: main.ConfigData): Promise<void> {
  return Promise.resolve();
}

export function LoadConfig(): Promise<main.ConfigData> {
  const config = new main.ConfigData();
  return Promise.resolve(config);
}

export function OpenURL(_url: string): Promise<void> {
  return Promise.resolve();
}

export function GetVersion(): Promise<string> {
  return Promise.resolve('1.0.0');
}
