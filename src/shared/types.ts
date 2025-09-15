export interface LiltConfig {
  sourceDir: string;
  targetDir: string;
  copyImages: boolean;
  useDocker: boolean;
  dockerImage: string;
  noPreserveMetadata: boolean;
  enforceOutputFormat: 'flac' | 'mp3' | 'alac' | '';
  liltBinaryPath: string;
  soxBinaryPath: string;
  ffmpegBinaryPath: string;
  ffprobeBinaryPath: string;
}

export interface AppSettings extends LiltConfig {
  language: string;
  lastUsedPaths: {
    sourceDir?: string;
    targetDir?: string;
    liltBinary?: string;
    soxBinary?: string;
    ffmpegBinary?: string;
    ffprobeBinary?: string;
  };
}

export interface ProcessStatus {
  isRunning: boolean;
  pid?: number;
  output: string[];
}

export interface BinaryInfo {
  name: string;
  path: string;
  version?: string;
  isAvailable: boolean;
}

export interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
}
