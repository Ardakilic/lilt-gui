import "@testing-library/jest-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { beforeAll, vi } from "vitest";

// Initialize i18next for tests
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  resources: {
    en: {
      translation: {
        app: {
          title: "Lilt GUI",
          subtitle: "Simplified Audio Transcoding",
          version: "Version {{version}}",
        },
        header: {
          help: "Help",
          language: "Language",
        },
        help: {
          title: "About Lilt GUI",
          description: "Lilt GUI is a modern graphical interface",
          whatIsLilt: "What is Lilt?",
          liltDescription: "Lilt is a command-line tool",
          features: "Features",
          featuresList: [
            "Convert FLAC, ALAC and MP3 files",
            "Support for multiple output formats (FLAC, MP3, ALAC)",
            "Preserve metadata and cover art",
            "Docker support for containerized execution",
            "Cross-platform: Windows, macOS, Linux",
          ],
          author: "Author",
          authorInfo: "Created by Arda Kilicdagi",
          visitGithub: "Visit GitHub Repository",
          close: "Close",
        },
        binaries: {
          title: "Binary Configuration",
          liltPath: "Lilt Binary",
          soxPath: "SoX or SoX_ng Binary",
          ffmpegPath: "FFmpeg Binary",
          ffprobePath: "FFprobe Binary",
          browse: "Browse",
          identify: "Identify",
        },
        options: {
          title: "Transcoding Options",
          useDocker: "Use Docker",
          enforceOutputFormat: "Enforce Output Format",
          noPreserveMetadata: "Don't Preserve Metadata",
          copyImages: "Copy Images",
        },
        folders: {
          title: "Folders",
          sourceDir: "Source Folder",
          targetDir: "Target Folder",
        },
        actions: {
          startTranscoding: "Start Transcoding",
          stopTranscoding: "Stop Transcoding",
          downloadLilt: "Download Lilt",
        },
        output: {
          title: "Output",
          clear: "Clear",
          waiting: "Waiting to start...",
        },
        validation: {
          liltPathRequired: "Lilt Binary path is required",
          soxPathRequired: "SoX Binary path is required when not using Docker",
          ffmpegPathRequired: "FFmpeg Binary path is required when not using Docker",
          ffprobePathRequired: "FFprobe Binary path is required when not using Docker",
          sourceDirRequired: "Source folder is required",
          targetDirRequired: "Target folder is required",
        },
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

// Mock Tauri APIs
beforeAll(() => {
  // Mock @tauri-apps/api/core
  vi.mock("@tauri-apps/api/core", () => ({
    invoke: vi.fn(),
  }));

  // Mock @tauri-apps/plugin-shell
  vi.mock("@tauri-apps/plugin-shell", () => ({
    open: vi.fn().mockResolvedValue(undefined),
  }));

  // Mock @tauri-apps/plugin-dialog
  vi.mock("@tauri-apps/plugin-dialog", () => ({
    DialogExt: vi.fn(),
  }));

  // Mock tauri service functions
  vi.mock("../services/tauri", () => ({
    startTranscoding: vi.fn().mockResolvedValue(undefined),
    stopTranscoding: vi.fn().mockResolvedValue(undefined),
    selectFile: vi.fn().mockResolvedValue("/mock/path/file"),
    selectDirectory: vi.fn().mockResolvedValue("/mock/path/dir"),
    findBinaryInPath: vi.fn().mockResolvedValue("/usr/bin/mock"),
  }));

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  global.localStorage = localStorageMock as unknown as Storage;
});
