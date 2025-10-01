import "@testing-library/jest-dom";
import { beforeAll, vi } from "vitest";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

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
    open: vi.fn(),
  }));

  // Mock @tauri-apps/plugin-dialog
  vi.mock("@tauri-apps/plugin-dialog", () => ({
    DialogExt: vi.fn(),
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
