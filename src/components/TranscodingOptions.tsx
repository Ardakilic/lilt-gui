import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Settings } from "../types";

interface TranscodingOptionsProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function TranscodingOptions({ settings, onSettingsChange }: TranscodingOptionsProps) {
  const { t } = useTranslation();

  const handleCheckboxChange = (field: keyof Settings, checked: boolean) => {
    onSettingsChange({ ...settings, [field]: checked });
  };

  const handleSelectChange = (field: keyof Settings, value: string) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <div className="section">
      <h2 className="section-title">{t("options.title")}</h2>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={settings.useDocker}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleCheckboxChange("useDocker", e.target.checked)
            }
          />
          <span>{t("options.useDocker")}</span>
          <span className="tooltip" title={t("options.useDockerTooltip")}>
            ℹ️
          </span>
        </label>
      </div>

      <div className="form-group">
        <label className="form-label">
          {t("options.enforceOutputFormat")}
          <span className="tooltip" title={t("options.enforceOutputFormatTooltip")}>
            ℹ️
          </span>
        </label>
        <select
          value={settings.enforceOutputFormat}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleSelectChange("enforceOutputFormat", e.target.value)
          }
        >
          <option value="">{t("options.formats.default")}</option>
          <option value="flac">{t("options.formats.flac")}</option>
          <option value="mp3">{t("options.formats.mp3")}</option>
          <option value="alac">{t("options.formats.alac")}</option>
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={settings.noPreserveMetadata}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleCheckboxChange("noPreserveMetadata", e.target.checked)
            }
          />
          <span>{t("options.noPreserveMetadata")}</span>
          <span className="tooltip" title={t("options.noPreserveMetadataTooltip")}>
            ℹ️
          </span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={settings.copyImages}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleCheckboxChange("copyImages", e.target.checked)
            }
          />
          <span>{t("options.copyImages")}</span>
          <span className="tooltip" title={t("options.copyImagesTooltip")}>
            ℹ️
          </span>
        </label>
      </div>
    </div>
  );
}
