export interface LiltConfig {
  liltPath: string;
  soxPath: string;
  soxNgPath: string;
  ffmpegPath: string;
  ffprobePath: string;
  useDocker: boolean;
  dockerImage: string;
  sourceDir: string;
  targetDir: string;
  copyImages: boolean;
  noPreserveMetadata: boolean;
  enforceOutputFormat: OutputFormat;
}

export type OutputFormat = '' | 'flac' | 'mp3' | 'alac';

export interface ProcessOutput {
  line: string;
  isError: boolean;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export interface BinaryPath {
  name: string;
  path: string;
  required: boolean;
  description: string;
}
