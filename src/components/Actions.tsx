import { useState } from "react";
import { useTranslation } from "react-i18next";
import { open } from "@tauri-apps/plugin-shell";
import type { Settings } from "../types";
import { startTranscoding, stopTranscoding } from "../services/tauri";

interface ActionsProps {
  settings: Settings;
  isRunning: boolean;
  onTranscodingStart: () => void;
  onTranscodingStop: () => void;
}

export function Actions({ settings, isRunning, onTranscodingStart, onTranscodingStop }: ActionsProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!settings.liltPath) {
      setError(t("validation.liltPathRequired"));
      return false;
    }
    if (!settings.useDocker) {
      if (!settings.soxPath) {
        setError(t("validation.soxPathRequired"));
        return false;
      }
      if (!settings.ffmpegPath) {
        setError(t("validation.ffmpegPathRequired"));
        return false;
      }
      if (!settings.ffprobePath) {
        setError(t("validation.ffprobePathRequired"));
        return false;
      }
    }
    if (!settings.sourceDir) {
      setError(t("validation.sourceDirRequired"));
      return false;
    }
    if (!settings.targetDir) {
      setError(t("validation.targetDirRequired"));
      return false;
    }
    setError(null);
    return true;
  };

  const handleStart = async () => {
    if (!validate()) {
      return;
    }
    try {
      await startTranscoding(settings);
      onTranscodingStart();
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleStop = async () => {
    try {
      await stopTranscoding();
      onTranscodingStop();
      setError(null);
    } catch (err) {
      setError(String(err));
    }
  };

  const handleDownload = async () => {
    try {
      // Check if we're in Tauri environment
      if (typeof window !== "undefined" && "__TAURI__" in window) {
        await open("https://github.com/Ardakilic/lilt/releases/latest");
      } else {
        // Fallback for browser dev mode
        window.open("https://github.com/Ardakilic/lilt/releases/latest", "_blank");
      }
    } catch (err) {
      // If Tauri fails, try browser fallback
      window.open("https://github.com/Ardakilic/lilt/releases/latest", "_blank");
    }
  };

  return (
    <div className="section">
      {error && (
        <div style={{ padding: "0.75rem", marginBottom: "1rem", backgroundColor: "var(--danger-color)", color: "white", borderRadius: "0.375rem" }}>
          {error}
        </div>
      )}
      <div className="actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleStart}
          disabled={isRunning}
        >
          {t("actions.startTranscoding")}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleStop}
          disabled={!isRunning}
        >
          {t("actions.stopTranscoding")}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDownload}
        >
          {t("actions.downloadLilt")}
        </button>
      </div>
    </div>
  );
}
