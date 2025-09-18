import { describe, it, expect } from 'vitest';
import {
  LiltConfig,
  OutputFormat,
  ProcessOutput,
  LanguageOption,
} from '../types/index';

describe('Type Definitions', () => {
  it('should define LiltConfig interface correctly', () => {
    const config: LiltConfig = {
      liltPath: '/usr/bin/lilt',
      soxPath: '/usr/bin/sox',
      soxNgPath: '/usr/bin/sox-ng',
      ffmpegPath: '/usr/bin/ffmpeg',
      ffprobePath: '/usr/bin/ffprobe',
      useDocker: false,
      dockerImage: 'ardakilic/sox_ng:latest',
      sourceDir: '/source',
      targetDir: '/target',
      copyImages: true,
      noPreserveMetadata: false,
      enforceOutputFormat: 'flac',
    };

    expect(config.liltPath).toBe('/usr/bin/lilt');
    expect(config.useDocker).toBe(false);
    expect(config.copyImages).toBe(true);
  });

  it('should define OutputFormat type correctly', () => {
    const formats: OutputFormat[] = ['', 'flac', 'mp3', 'alac'];

    expect(formats).toContain('');
    expect(formats).toContain('flac');
    expect(formats).toContain('mp3');
    expect(formats).toContain('alac');
  });

  it('should define ProcessOutput interface correctly', () => {
    const output: ProcessOutput = {
      line: 'Processing file...',
      isError: false,
    };

    expect(output.line).toBe('Processing file...');
    expect(output.isError).toBe(false);
  });

  it('should define LanguageOption interface correctly', () => {
    const language: LanguageOption = {
      code: 'en',
      name: 'English',
      nativeName: 'English',
    };

    expect(language.code).toBe('en');
    expect(language.name).toBe('English');
    expect(language.nativeName).toBe('English');
  });
});
