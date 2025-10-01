export interface Settings {
  liltPath: string;
  soxPath: string;
  ffmpegPath: string;
  ffprobePath: string;
  useDocker: boolean;
  enforceOutputFormat: string;
  noPreserveMetadata: boolean;
  copyImages: boolean;
  sourceDir: string;
  targetDir: string;
}

export const defaultSettings: Settings = {
  liltPath: "",
  soxPath: "",
  ffmpegPath: "",
  ffprobePath: "",
  useDocker: true,
  enforceOutputFormat: "",
  noPreserveMetadata: false,
  copyImages: true,
  sourceDir: "",
  targetDir: "",
};
