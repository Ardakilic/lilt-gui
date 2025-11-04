export namespace main {
  export class TranscodeConfig {
    liltBinary: string;
    soxBinary: string;
    soxNgBinary: string;
    ffmpegBinary: string;
    ffprobeBinary: string;
    useDocker: boolean;
    outputFormat: string;
    noPreserveMetadata: boolean;
    copyImages: boolean;
    sourceDir: string;
    targetDir: string;

    constructor() {
      this.liltBinary = '';
      this.soxBinary = '';
      this.soxNgBinary = '';
      this.ffmpegBinary = '';
      this.ffprobeBinary = '';
      this.useDocker = true;
      this.outputFormat = 'flac';
      this.noPreserveMetadata = false;
      this.copyImages = true;
      this.sourceDir = '';
      this.targetDir = '';
    }
  }

  export class ConfigData {
    lastConfig: TranscodeConfig;
    language: string;

    constructor() {
      this.lastConfig = new TranscodeConfig();
      this.language = 'en';
    }
  }
}
