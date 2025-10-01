import { type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Settings } from "../types";
import { selectDirectory } from "../services/tauri";

interface FolderSelectionProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function FolderSelection({ settings, onSettingsChange }: FolderSelectionProps) {
  const { t } = useTranslation();

  const handleBrowse = async (field: keyof Settings) => {
    try {
      // Check if we're in Tauri environment
      if (typeof window !== "undefined" && "__TAURI__" in window) {
        const path = await selectDirectory(t(`folders.${field}`));
        if (path) {
          onSettingsChange({ ...settings, [field]: path });
        }
      } else {
        // In browser dev mode, show an alert
        alert("File dialogs only work in the Tauri app. Use 'make dev-tauri' to test this feature.");
      }
    } catch (error) {
      console.error("Failed to select directory:", error);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <div className="section">
      <h2 className="section-title">{t("folders.title")}</h2>

      <div className="form-group">
        <label className="form-label">
          {t("folders.sourceDir")}
          <span className="required">*</span>
          <span className="tooltip" title={t("folders.sourceDirTooltip")}>
            ℹ️
          </span>
        </label>
        <div className="input-group">
          <input
            type="text"
            value={settings.sourceDir}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange("sourceDir", e.target.value)
            }
            placeholder="/path/to/source"
          />
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => handleBrowse("sourceDir")}
          >
            {t("binaries.browse")}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t("folders.targetDir")}
          <span className="required">*</span>
          <span className="tooltip" title={t("folders.targetDirTooltip")}>
            ℹ️
          </span>
        </label>
        <div className="input-group">
          <input
            type="text"
            value={settings.targetDir}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange("targetDir", e.target.value)
            }
            placeholder="/path/to/target"
          />
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => handleBrowse("targetDir")}
          >
            {t("binaries.browse")}
          </button>
        </div>
      </div>
    </div>
  );
}
