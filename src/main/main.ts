import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import { join } from 'path';
import Store from 'electron-store';
import { AppSettings, LiltConfig, ProcessStatus, BinaryInfo } from '@shared/types';
import { exec, spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import { access, constants } from 'fs';

const execAsync = promisify(exec);
const accessAsync = promisify(access);

// Type-safe interface for electron-store methods
interface TypedStore<T> {
  store: T;
  set(object: Partial<T>): void;
  set<K extends keyof T>(key: K, value: T[K]): void;
  get<K extends keyof T>(key: K): T[K];
  get(): T;
}



class LiltGUI {
  private mainWindow: BrowserWindow | null = null;
  private store: Store<AppSettings>;
  private liltProcess: ChildProcess | null = null;
  private processStatus: ProcessStatus = { isRunning: false, output: [] };

  constructor() {
    this.store = new Store<AppSettings>({
      defaults: {
        sourceDir: '',
        targetDir: '',
        copyImages: true,
        useDocker: true,
        dockerImage: 'ardakilic/sox_ng:latest',
        noPreserveMetadata: false,
        enforceOutputFormat: 'flac',
        liltBinaryPath: '',
        soxBinaryPath: '',
        ffmpegBinaryPath: '',
        ffprobeBinaryPath: '',
        language: 'en',
        lastUsedPaths: {}
      }
    });

    this.setupElectronEvents();
    this.setupIpcHandlers();
  }

  private setupElectronEvents() {
    app.whenReady().then(() => {
      this.createWindow();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('before-quit', () => {
      this.killLiltProcess();
    });
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, '../renderer/preload.js'),
      },
      icon: join(__dirname, '../../assets/icon.png'),
      show: false,
    });

    // Load the app
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:3000');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });
  }

  private setupIpcHandlers() {
    // Settings management
    ipcMain.handle('get-settings', () => {
      // Return all settings using the store property
      return (this.store as unknown as TypedStore<AppSettings>).store;
    });

    ipcMain.handle('save-settings', (_event, settings: Partial<AppSettings>) => {
      // Update multiple properties using the set method with an object
      (this.store as unknown as TypedStore<AppSettings>).set(settings);
      
      // Return all current settings
      return (this.store as unknown as TypedStore<AppSettings>).store;
    });

    // File/folder selection
    ipcMain.handle('select-folder', async () => {
      if (!this.mainWindow) return null;
      
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openDirectory']
      });
      
      return result.canceled ? null : result.filePaths[0];
    });

    ipcMain.handle('select-file', async (_event, filters?: Electron.FileFilter[]) => {
      if (!this.mainWindow) return null;
      
      const result = await dialog.showOpenDialog(this.mainWindow, {
        properties: ['openFile'],
        filters: filters || [{ name: 'All Files', extensions: ['*'] }]
      });
      
      return result.canceled ? null : result.filePaths[0];
    });

    // Binary identification
    ipcMain.handle('identify-binary', async (_event, binaryName: string) => {
      return await this.identifyBinaryInPath(binaryName);
    });

    ipcMain.handle('check-binary', async (_event, binaryPath: string) => {
      return await this.checkBinary(binaryPath);
    });

    // Process management
    ipcMain.handle('start-lilt', async (_event, config: LiltConfig) => {
      return await this.startLiltProcess(config);
    });

    ipcMain.handle('stop-lilt', () => {
      this.killLiltProcess();
      return { success: true };
    });

    ipcMain.handle('get-process-status', () => {
      return this.processStatus;
    });

    // Utility functions
    ipcMain.handle('open-external', (_event, url: string) => {
      shell.openExternal(url);
    });

    ipcMain.handle('get-app-version', () => {
      return app.getVersion();
    });

    ipcMain.handle('get-platform-info', () => {
      return {
        platform: process.platform,
        arch: process.arch
      };
    });
  }

  private async identifyBinaryInPath(binaryName: string): Promise<BinaryInfo> {
    try {
      const command = process.platform === 'win32' ? 'where' : 'which';
      const { stdout } = await execAsync(`${command} ${binaryName}`);
      const path = stdout.trim().split('\n')[0];
      
      if (path) {
        const info = await this.checkBinary(path);
        return {
          name: binaryName,
          path,
          version: info.version,
          isAvailable: true
        };
      }
    } catch (error) {
      console.error(`Binary ${binaryName} not found in PATH:`, error);
    }

    return {
      name: binaryName,
      path: '',
      isAvailable: false
    };
  }

  private async checkBinary(binaryPath: string): Promise<{ isValid: boolean; version?: string }> {
    try {
      await accessAsync(binaryPath, constants.F_OK | constants.X_OK);
      
      // Try to get version
      try {
        const { stdout } = await execAsync(`"${binaryPath}" --version`);
        const version = stdout.trim().split('\n')[0];
        return { isValid: true, version };
      } catch {
        // Version command failed, but binary exists and is executable
        return { isValid: true };
      }
    } catch {
      return { isValid: false };
    }
  }

  private async startLiltProcess(config: LiltConfig): Promise<{ success: boolean; error?: string }> {
    if (this.liltProcess) {
      return { success: false, error: 'A process is already running' };
    }

    try {
      const args = this.buildLiltArgs(config);
      
      this.liltProcess = spawn(config.liltBinaryPath, args, {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.processStatus = {
        isRunning: true,
        pid: this.liltProcess.pid,
        output: []
      };

      // Handle process output
      this.liltProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        this.processStatus.output.push(output);
        this.mainWindow?.webContents.send('lilt-output', output);
      });

      this.liltProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        this.processStatus.output.push(output);
        this.mainWindow?.webContents.send('lilt-output', output);
      });

      this.liltProcess.on('close', (code) => {
        this.processStatus.isRunning = false;
        this.processStatus.pid = undefined;
        this.liltProcess = null;
        
        const message = `Process exited with code ${code}`;
        this.processStatus.output.push(message);
        this.mainWindow?.webContents.send('lilt-finished', { code, message });
      });

      this.liltProcess.on('error', (error) => {
        this.processStatus.isRunning = false;
        this.processStatus.pid = undefined;
        this.liltProcess = null;
        
        const message = `Process error: ${error.message}`;
        this.processStatus.output.push(message);
        this.mainWindow?.webContents.send('lilt-error', { error: error.message });
      });

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private buildLiltArgs(config: LiltConfig): string[] {
    const args: string[] = [];

    // Source directory (required)
    args.push(config.sourceDir);

    // Target directory
    if (config.targetDir) {
      args.push('--target-dir', config.targetDir);
    }

    // Copy images
    if (config.copyImages) {
      args.push('--copy-images');
    }

    // Use Docker
    if (config.useDocker) {
      args.push('--use-docker');
      if (config.dockerImage) {
        args.push('--docker-image', config.dockerImage);
      }
    }

    // No preserve metadata
    if (config.noPreserveMetadata) {
      args.push('--no-preserve-metadata');
    }

    // Enforce output format
    if (config.enforceOutputFormat) {
      args.push('--enforce-output-format', config.enforceOutputFormat);
    }

    return args;
  }

  private killLiltProcess() {
    if (this.liltProcess && this.processStatus.isRunning) {
      this.liltProcess.kill('SIGTERM');
      
      // Force kill after 5 seconds if process doesn't respond
      setTimeout(() => {
        if (this.liltProcess && this.processStatus.isRunning) {
          this.liltProcess.kill('SIGKILL');
        }
      }, 5000);
    }
  }

  private getPlatformInfo(): { os: string; arch: string; ext: string } | null {
    const platform = process.platform;
    const arch = process.arch;

    let os: string;
    let archName: string;
    let ext: string;

    // Map platform
    switch (platform) {
      case 'darwin':
        os = 'darwin';
        ext = '';
        break;
      case 'linux':
        os = 'linux';
        ext = '';
        break;
      case 'win32':
        os = 'windows';
        ext = '.exe';
        break;
      default:
        return null;
    }

    // Map architecture
    switch (arch) {
      case 'x64':
        archName = 'amd64';
        break;
      case 'arm64':
        archName = 'arm64';
        break;
      case 'ia32':
        archName = '386';
        break;
      case 'arm':
        archName = 'arm';
        break;
      default:
        return null;
    }

    return { os, arch: archName, ext };
  }
}

// Initialize the application
new LiltGUI();
