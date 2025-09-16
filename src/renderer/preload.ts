import { contextBridge, ipcRenderer } from 'electron';
import { AppSettings, LiltConfig, ProcessStatus, BinaryInfo } from '@shared/types';

const electronAPI = {
  // Settings
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Partial<AppSettings>): Promise<AppSettings> => 
    ipcRenderer.invoke('save-settings', settings),

  // File/folder selection
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('select-folder'),
  selectFile: (filters?: Electron.FileFilter[]): Promise<string | null> => 
    ipcRenderer.invoke('select-file', filters),

  // Binary management
  identifyBinary: (binaryName: string): Promise<BinaryInfo> => 
    ipcRenderer.invoke('identify-binary', binaryName),
  checkBinary: (binaryPath: string): Promise<{ isValid: boolean; version?: string }> => 
    ipcRenderer.invoke('check-binary', binaryPath),

  // Process management
  startLilt: (config: LiltConfig): Promise<{ success: boolean; error?: string }> => 
    ipcRenderer.invoke('start-lilt', config),
  stopLilt: (): Promise<{ success: boolean }> => ipcRenderer.invoke('stop-lilt'),
  getProcessStatus: (): Promise<ProcessStatus> => ipcRenderer.invoke('get-process-status'),

  // Utility
  openExternal: (url: string): Promise<void> => ipcRenderer.invoke('open-external', url),
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version'),
  getPlatformInfo: (): Promise<{ platform: string; arch: string }> => 
    ipcRenderer.invoke('get-platform-info'),

  // Event listeners
  onLiltOutput: (callback: (output: string) => void) => {
    ipcRenderer.on('lilt-output', (_event, output) => callback(output));
  },
  onLiltFinished: (callback: (result: { code: number; message: string }) => void) => {
    ipcRenderer.on('lilt-finished', (_event, result) => callback(result));
  },
  onLiltError: (callback: (error: { error: string }) => void) => {
    ipcRenderer.on('lilt-error', (_event, error) => callback(error));
  },
  
  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;
