import { type ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { findBinaryInPath, selectFile } from "../services/tauri";
import type { Settings } from "../types";

interface BinaryConfigProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function BinaryConfig({ settings, onSettingsChange }: BinaryConfigProps) {
  const { t } = useTranslation();
  const [identifyStatus, setIdentifyStatus] = useState<Record<string, string>>({});

  const handleBrowse = async (field: keyof Settings) => {
    try {
      // Check if we're in Tauri environment
      if (typeof window !== "undefined" && "__TAURI__" in window) {
        const path = await selectFile(t(`binaries.${field}`));
        onSettingsChange({ ...settings, [field]: path });
      } else {
        // In browser dev mode, show an alert
        alert(
          "File dialogs only work in the Tauri app. Use 'make dev-tauri' to test this feature.",
        );
      }
    } catch (error) {
      console.error("Failed to select file:", error);
    }
  };

  const handleIdentify = async (field: keyof Settings, binaryName: string) => {
    try {
      const path = await findBinaryInPath(binaryName);
      onSettingsChange({ ...settings, [field]: path });
      setIdentifyStatus({ ...identifyStatus, [field]: t("binaries.identifySuccess", { path }) });
    } catch (_error) {
      setIdentifyStatus({ ...identifyStatus, [field]: t("binaries.identifyError") });
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const binaryFields = [
    { key: "liltPath" as const, binary: "lilt", required: true },
    { key: "soxPath" as const, binary: "sox", required: !settings.useDocker },
    { key: "ffmpegPath" as const, binary: "ffmpeg", required: !settings.useDocker },
    { key: "ffprobePath" as const, binary: "ffprobe", required: !settings.useDocker },
  ];

  return (
    <div className="section">
      <h2 className="section-title">{t("binaries.title")}</h2>
      {binaryFields.map(({ key, binary, required }) => (
        <div key={key} className="form-group">
          <label className="form-label">
            {t(`binaries.${key}`)}
            {required && <span className="required">*</span>}
            <span className="tooltip" title={t(`binaries.${key}Tooltip`)}>
              ℹ️
            </span>
          </label>
          <div className="input-group">
            <input
              type="text"
              value={settings[key]}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)}
              disabled={key !== "liltPath" && settings.useDocker}
              placeholder={`/path/to/${binary}`}
            />
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => handleBrowse(key)}
              disabled={key !== "liltPath" && settings.useDocker}
            >
              {t("binaries.browse")}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => handleIdentify(key, binary)}
              disabled={key !== "liltPath" && settings.useDocker}
            >
              {t("binaries.identify")}
            </button>
          </div>
          {identifyStatus[key] && (
            <p
              style={{ fontSize: "0.75rem", marginTop: "0.25rem", color: "var(--text-secondary)" }}
            >
              {identifyStatus[key]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
