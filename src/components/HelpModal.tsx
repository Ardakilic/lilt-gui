import { open } from "@tauri-apps/plugin-shell";
import { useTranslation } from "react-i18next";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleGithubClick = async () => {
    try {
      await open("https://github.com/Ardakilic/");
    } catch (error) {
      console.error("Failed to open URL:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("help.title")}</h2>
        </div>
        <div className="modal-body">
          <p>{t("help.description")}</p>

          <h3>{t("help.whatIsLilt")}</h3>
          <p>{t("help.liltDescription")}</p>

          <h3>{t("help.features")}</h3>
          <ul>
            {(t("help.featuresList", { returnObjects: true }) as string[]).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          <h3>{t("help.author")}</h3>
          <p>{t("help.authorInfo")}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGithubClick}
            style={{ marginTop: "0.5rem" }}
          >
            {t("help.visitGithub")}
          </button>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            {t("help.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
